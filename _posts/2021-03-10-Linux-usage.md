---
layout: post
title: "Linux大杂烩"
categories: Linux
tags: Linux
---

* TOC
{:toc}

### VIM

删除至文件尾部: dG

删除至文件首部: d1G

### Terminal

ctrl + a 将光标移到命令开头

ctrl + e 光标移动到尾部

ctrl + w 删除一个单词

ctrl + u 删除从光标位置到开始

ctrl + k 删除从光标到结尾

ctrl + s 冻结屏幕日志滚动

ctrl + q 恢复屏幕日志滚动

common + shift + . 显示和隐藏隐藏文件

```bash
# 设备brew 全局代理
$ export ALL_PROXY=socks5://172.0.0.1:1086
```

### 管道

```bash
# 批量解压某个文件夹下面的所有tar.gz文件
$ ls *.tar.gz | xargs -n1 tar zxvf
```

### 结果作为命令入参

```bash
# 使用$()来入参
$ jstat -gcutil $(jps -l | grep "xxxApplication" | awk '{print $1}') 1s

# 使用`来入参
$ jstat -gcutil `jps -l | grep "xxxApplication" | awk '{print $1}'` 1000

# 前面的结果作为后面的入参可以使用xargs
```

### 传输文件

```bash
# python2.7
python -m SimpleHTTPServer 8888

# >python3
python -m http.server

# scp
scp heapDumpOnOutOfMemoryError.dump dengkaidifoxmail.com@172.22.4.223:/Users/dengkaidifoxmail.com/tmp
```

### mac brew err

```bash
$ brew cask reinstall wireshark
==> Satisfying dependencies
==> Downloading https://www.wireshark.org/download/osx/Wireshark%203.0.2%20Intel
######################################################################## 100.0%
==> Verifying SHA-256 checksum for Cask 'wireshark'.
Error: Cask 'wireshark' definition is invalid: invalid 'depends_on macos' value: ":mountain_lion"

# 使用下面的命令来修复
 $ /usr/bin/find "$(brew --prefix)/Caskroom/"*'/.metadata' -type f -name '*.rb' -print0 | /usr/bin/xargs -0 /usr/bin/perl -i -pe 's/depends_on macos: \[.*?\]//gsm;s/depends_on macos: .*//g'

# 再次执行安装命令即可
 $ brew cask reinstall wireshark
```

### 打包/解压

```bash
$ tar -czvf xxx.tar.gz ./*
```

### Mac ReadOnly

```bash
$ sudo mount -uw /
```

### 统计连接数

```bash
$ netstat -n | awk '/^tcp/ {++S[$NF]} END {for(a in S) print a, S[a]}'  统计连接状态
```

### awk使用

```bash
$ grep exception_code 20200515.4.log > exception.log
# 去除{,},"msg":"tag":字段
$ sed "s/{//g" exception.log | sed "s/}//g" | sed "s/\"msg\":\"tag\"://g" > exception1.log
# 统计出现imei次数统计
$ awk -F '"' '{print $10}' exception1.log | sort | uniq -c | sort -rnk 1
```

### load usage

```bash
#!/bin/bash
LANG=C
PATH=/sbin:/usr/sbin:/bin:/usr/bin
interval=1
length=86400
for i in $(seq 1 $(expr ${length} / ${interval}));do
date
LANG=C ps -eTo stat,pid,tid,ppid,comm --no-header | sed -e 's/^ \*//' | perl -nE 'chomp;say if (m!^\S*[RD]+\S*!)'
date
cat /proc/loadavg
echo -e "\n"
sleep ${interval}
done
```

### cpu usage

```bash
#!/bin/bash
LANG=C
PATH=/sbin:/usr/sbin:/bin:/usr/bin
interval=1
length=86400
for i in $(seq 1 $(expr ${length} / ${interval}));do
date
LANG=C ps -eT -o%cpu,pid,tid,ppid,comm | grep -v CPU | sort -n -r | head -20
date
LANG=C cat /proc/loadavg
{ LANG=C ps -eT -o%cpu,pid,tid,ppid,comm | sed -e 's/^ *//' | tr -s ' ' | grep -v CPU | sort -n -r | cut -d ' ' -f 1 | xargs -I{} echo -n "{} + " && echo ' 0'; } | bc -l
sleep ${interval}
done
fuser -k $0
```

### IDEA 全局替换删除行

```bash
# 案例：正则匹配以@Scope开头行，并删除行, 思路：匹配该行和下一行。
# 正则如下：^\@Scope.*$\n
# ^: 表示开始
# $: 结尾
```

### 筛选某个时间段日志

```bash
# 使用sed筛选满足条件的日志，⚠️输入的日期一定要在日志中有不然可能指令筛选失败
$ sed -n '/2021-02-04 19:47:43/,/2021-02-04 22:20:00/p' create_file.log | less
```

### 获取外网IP

```bash
$ dig +short myip.opendns.com @resolver1.opendns.com
```
