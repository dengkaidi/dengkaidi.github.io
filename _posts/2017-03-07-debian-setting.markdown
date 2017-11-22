---
layout: post
title:  Debian 初始化记录
date: 2017-03-07 19:04:28 +0800
categories: Acrux update
tags: linux  
---

* TOC
{:toc}

> 寒假回家升级Debian到9时，Linux Kernel 升到4.9电脑只能启动windows10，今天
闲来无聊重操旧业--装系统。装好之后发现了之前解决的问题又忘记怎么解决了，
现在打算做个备份供以后参考。

## U盘启动制作

>
Debian类用户dd命令解决：
{% highlight shell %}
$ dd if xxx.iso of=/dev/sdb bs=1M
{% endhighlight %}
>
windows用户推荐使用[Rufus](http://rufus.akeo.ie/)工具进行U盘刻录

## apt source
>
配置软件的安装源： 
>
{% highlight shell %}
$ sudo vim /etc/apt/sources.list
{% endhighlight %}
>
添加如下内容: 
>
<code>deb http://httpredir.debian.org/debian sid main</code> 
>
<code>deb-src http://httpredir.debian.org/debian sid main</code>

## 解决Y410P开关机、拔插耳机有pop音
>
1.使用<code>sudo alsamixer</code>命令打开配置<code>F6</code>选择intel
PCI选项找到<code>Auto-Mute</code>设置为Disabled

>
2.执行：
{% highlight shell %}
$ sudo vim /etc/modprobe.d/modesetting.conf
添加： options snd-hda-intel model=,generic
{% endhighlight %}

## 网络配置
>
1.安装的Debian默认使用/etc/network/interfaces配置文件来管理网络，要使NetworkManager软件生效需要到<code>/etc/NetworkManager/NetworkManager.conf</code>下面把<code>false</code>改为<code>true</code>

>
2.使用命令行连接到WiFi：
{% highlight shell %}
$ sudo vim /etc/network/interfaces
 insert:
    auto wlan0
    iface wlan0 inet dhcp
    pre-up ip link set wlan0 up
    pre-up iwconfig wlan0 essid ssid
    wpa-ssid Touch  # Touch 为你要连接的wifi名称
    wpa-psk password1111

$ sudo ifup wlan0
{% endhighlight %}
