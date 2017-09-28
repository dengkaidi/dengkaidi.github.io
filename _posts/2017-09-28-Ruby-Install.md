---
layout: post
title: "Ruby installation"
date: 2017-09-28 21:17:04 +0800 
categories: Raspberry update
tags: software 
---

* TOC
{:toc}

### bundle failed
>
```shell
$ sudo bundle install ffi
```
output:
>>
ERROR: Failed to build gem native extension.
>
Because uninstall ruby2.3-dev
+So -_- -->:
```shell
$ sudo apt install ruby2.3-dev -y
```
