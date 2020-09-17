---
layout: post
title: "Spring Boot启动慢优化"
categories: 编程
tags: Java JVM
---

* TOC
{:toc}

### 背景
项目使用spring boot框架，在开发环境和测试环境启动没有问题。测试人员每次jenkins发布线上环境时，老是会阻塞在某个地方等个一分钟左右才会继续打印启动日志。

top 看了一下各项指标正常

线程阻塞状态下多次jstack线程日志，发现如下日志信息比较可疑

```bash
"localhost-startStop-1" #37 daemon prio=5 os_prio=0 tid=0x00007fe65c007000 nid=0x4017 runnable [0x00007fe6889d3000]
   java.lang.Thread.State: RUNNABLE
	at java.io.FileInputStream.readBytes(Native Method)
	at java.io.FileInputStream.read(FileInputStream.java:255)
	at sun.security.provider.SeedGenerator$URLSeedGenerator.getSeedBytes(SeedGenerator.java:539)
	at sun.security.provider.SeedGenerator.generateSeed(SeedGenerator.java:144)
	at sun.security.provider.SecureRandom$SeederHolder.<clinit>(SecureRandom.java:203)
	at sun.security.provider.SecureRandom.engineNextBytes(SecureRandom.java:221)
	- locked <0x00000007b826ae70> (a sun.security.provider.SecureRandom)
	at java.security.SecureRandom.nextBytes(SecureRandom.java:468)
	- locked <0x00000007b826b190> (a java.security.SecureRandom)
	at java.security.SecureRandom.next(SecureRandom.java:491)
	at java.util.Random.nextInt(Random.java:329)
	at org.apache.catalina.util.SessionIdGeneratorBase.createSecureRandom(SessionIdGeneratorBase.java:237)
	at org.apache.catalina.util.SessionIdGeneratorBase.getRandomBytes(SessionIdGeneratorBase.java:174)
	at org.apache.catalina.util.StandardSessionIdGenerator.generateSessionId(StandardSessionIdGenerator.java:34)
	at org.apache.catalina.util.SessionIdGeneratorBase.generateSessionId(SessionIdGeneratorBase.java:167)
	at org.apache.catalina.util.SessionIdGeneratorBase.startInternal(SessionIdGeneratorBase.java:256)
	at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:150)
	- locked <0x00000007b826aaa8> (a org.apache.catalina.util.StandardSessionIdGenerator)
	at org.apache.catalina.session.ManagerBase.startInternal(ManagerBase.java:620)
	at org.apache.catalina.session.StandardManager.startInternal(StandardManager.java:456)
	- locked <0x00000007b1af0e40> (a org.apache.catalina.session.StandardManager)
	at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:150)
	- locked <0x00000007b1af0e40> (a org.apache.catalina.session.StandardManager)
	at org.apache.catalina.core.StandardContext.startInternal(StandardContext.java:5272)
	- locked <0x00000007b2213788> (a org.springframework.boot.context.embedded.tomcat.TomcatEmbeddedContext)
	at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:150)
	- locked <0x00000007b2213788> (a org.springframework.boot.context.embedded.tomcat.TomcatEmbeddedContext)
	at org.apache.catalina.core.ContainerBase$StartChild.call(ContainerBase.java:1408)
	at org.apache.catalina.core.ContainerBase$StartChild.call(ContainerBase.java:1398)
	at java.util.concurrent.FutureTask.run(FutureTask.java:266)
	at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)
	at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:617)
	at java.lang.Thread.run(Thread.java:745)
```

初步定位是tomcat的session id的生成主要通过java.security.SecureRandom生成随机数来实现。```URLSeedGenerator.getSeedBytes()```方法发生了阻塞，查看了一下源码：

```java
@Override
void getSeedBytes(byte[] result) {
            int len = result.length;
            int read = 0;
            try {
                while (read < len) {
                    int count = seedStream.read(result, read, len - read);
                    // /dev/random blocks - should never have EOF
                    if (count < 0) {
                        throw new InternalError(
                            "URLSeedGenerator " + deviceName +
                            " reached end of file");
                    }
                    read += count;
                }
            } catch (IOException ioe) {
                throw new InternalError("URLSeedGenerator " + deviceName +
                    " generated exception: " + ioe.getMessage(), ioe);
            }
        }
```

网上查询了一下/dev/random用于生成真随机数，在熵用完情况下会一直阻塞等到熵池中有足够的熵。

JDK默认配置如下：

```bash
# $JAVA_HOME/jre/lib/security/java.security

securerandom.source=file:/dev/urandom
```


### 解决方案

因为不是支付类系统对随机数的要求不高，再加之系统中基本没有使用到随机函数，可以改为使用无阻塞的熵池，具体修改如下 ：

```java
// 启动脚本中添加如下JVM参数配置， 注意【.】的用法
-Djava.security.egd=file:/dev/./urandom
```
