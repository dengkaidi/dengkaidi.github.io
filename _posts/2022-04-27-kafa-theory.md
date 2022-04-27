---
categories: "编程"
layout: post
tags: "Kafka"
title: Kafka总结
---

* TOC
{:toc}

### 持久化
- 顺序写代替随机写。引自kafka官网：```As a result the performance of linear writes on a JBOD configuration with six 7200rpm SATA RAID-5 array is about 600MB/sec but the performance of random writes is only about 100k/sec—a difference of over 6000X```。
- pagecache机制避免GC；JVM内存模型决定了数据要存储一份到主存中，使用pagecache避免了数据再存储一次且pagecache是二进制存储，JVM中是对象存储存储效率更高；当服务重启时需要重建主存（10GB数据耗时10min），但是JVM重启不会影响到pagecache。
- 每个消费队列使用queue而不是BTree。BTree在大多数消息系统中都是不错的选择，BTree的操作复杂度是O(logN)在N趋近∞大时，近似为一个常量值，但是对于磁盘的操作不是这样的。磁盘上的一次pop需要耗时10ms，磁盘在读取数据时并行数只能为1。借鉴日志存储场景构建一个不断追加消息的队列，队列的操作复杂度是O(1)并且读操作不会阻塞写操作。
  
### 效率
- 磁盘方面效率一个是已经讨论的顺序写，另外还有两个优化点：大量的小I/O操作和过度的字节拷贝。前者主要是通过批处理解决，批量的发送消息和批量的消费消息。后者使用零拷贝机制直接pagecahe数据拷贝到NIC buffer，避免数据从内核态拷贝到用户态，再从用户态拷贝到内核态最终拷贝到NIC buffer。
- 一些场景下高吞吐的瓶颈在于带宽，而不是磁盘。kafka使用批量压缩消息而不是逐条压缩消息，支持的压缩：GZIP, Snappy, LZ4, ZStandard
  
### 生产者
#### 负载均衡
- 直接将消息发送的对应partition leader的broker服务，没有路由。
- 客户端通过高阶发送API对key进行hash确定要发往的partition，当然也可自定义发送的partition。

#### 异步发送
批处理是提升效率的重要因素之一，kafka支持在内存中累计一定的批操作，通过单个请求发送多个批处理。

#### 配置
- 核心配置：<code>bootstrap.servers</code> 帮助客户端找到kafka集群；<code>client.id</code> 不是必要配置但是可以帮助broker关联收到的request。
- 消息传输可靠性：<code>acks</code> 默认1。0: 不保证消息投递成功，但是吞吐量提升到极致；1: leader节点写入成功就返回；all: 不仅leader节点写入成功，相应的副本节点也写入成功。
- 消息的有序性：如果配置了<code>retries</code> > 0 时，当消息发送到broker失败，重试的时候可能存在之后的请求已经写入成功，存在消息乱序的情况，可以配置<code>max.in.flight.requests.per.connection</code> = 0 来保证一个连接里面只能有一个request动作。
- 批量与压缩：<code>batch.size</code> 控制每次请求的字节数；<code>linger.ms</code> delay 多久发送；<code>compression.type</code> 压缩类型。
> 当使用snappy压缩，取保kafka进程对/tmp有写的权限。也可通过```-Dorg.xerial.snappy.tempdir=/path/to/newtmp``` 自定义路径。

### 消费
#### push vs pull
 Kafka和传统的大多数消息中间件采取的方式一样，生产者使用push方式，消费组使用pull方式。push和pull各有优势。push 通过broker控制消息投递速率可以保证消息的实时性，但是需要消费方有能处理最大推送速率的能力。pull 由消费方控制消息获取的速率，但是存在消息获取延迟问题，可以适当调整pull的间隔来近似达到push的实时性。

 #### 消费组
- partition和consumer线程是N:1关系，确保了特定的消息队列只被同一组下的一个消费线程处理，避免锁竞争。
- 之前的版本使用zookeeper来管理消费组，新版本kafka使用自身来管理去除对zk的依赖。
- kafka内部使用topic<code>__consumer_offsets</code>来管理消费的offset，hash到的partition的leader节点即为当前消费组的协调者。
- 当一个消费组内有新成员加入消费时触发rebalance，成员需要定期发送心跳给到协调者，当长期没有收到心跳数据，协调者会将成员踢下线，持有的partition分配给其他成员。

#### offset管理
