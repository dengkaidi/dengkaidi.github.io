---
layout: post
title: "Shadowsocks 配置"
date: 2017-09-23 22:26:00 +0800
categories: Dundee life
tags: Raspberry socket5
---

* TOC
{:toc}

### ssh remote server

<p><b>鏈接vps，<shell>ssh -p portid username@serverIp </shell> </b></p>

```
$ sudo apt update && sudo apt upgrade 
$ sudo apt install shadowsocks-libev
```

### 配置 config

<p><b>按照配置文件裏面的注釋進行設置</b></p>
```
$ sudo vim /etc/shadowsock-libev/config.json
```

### 本地全局代理

<p><b> 因爲使用的是樹莓派 pi3 安裝瀏覽器代理資源消耗太大，使用全局代理的方式</b></p>
>
  首先需要配置下防火牆
```
// 起個名字
$ sudo iptables -t nat -N SHADOWSOCKS

// 最關鍵的一不 設置遠程服務器地址
$ sudo iptables -t nat -A SHADOWSOCKS -d 123.123.123.123 -j RETURN

// 添加你想和服務器一樣需要過濾的地址
// 比如： 鏈接的路由器地址
$ sudo iptables -t nat -A SHADOWSOCKS -d 0.0.0.0/8 -j RETURN
$ sudo iptables -t nat -A SHADOWSOCKS -d 10.0.0.0/8 -j RETURN
$ sudo iptables -t nat -A SHADOWSOCKS -d 127.0.0.0/8 -j RETURN
$ sudo iptables -t nat -A SHADOWSOCKS -d 169.254.0.0/16 -j RETURN
$ sudo iptables -t nat -A SHADOWSOCKS -d 172.16.0.0/12 -j RETURN
$ sudo iptables -t nat -A SHADOWSOCKS -d 192.168.0.0/16 -j RETURN
$ sudo iptables -t nat -A SHADOWSOCKS -d 224.0.0.0/4 -j RETURN

// 將其他請求的IP都發往 1080 端口
$ sudo iptables -t nat -A SHADOWSOCKS -p tcp -j REDIRECT --to-ports 1080

// 使上面配置的防火牆生效
$ sudo iptables -t nat -A OUTPUT -p tcp -j SHADOWSOCKS

```

>
啓動全局代理：
```
sudo ss-redir -s remoteIp -p remotePort -l 1080 -k password -m aes-256-cfb  
```

