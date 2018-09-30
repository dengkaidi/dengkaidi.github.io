---
title: 使用EFB实现Telegram收发微信
layout: post
date:  2018-09-30 19:08:00 +0800
tags: 
- Telegram
- Python
category:
- 生活
---

* TOC
{:toc}

### 安装Python3.6+
>截至目前Debian 9.5 stretch stable Python为3.5，需要自行安装高版本。使用从test里面获取安装：
```
$ sudo echo 'deb http://ftp.de.debian.org/debian testing main' >> /etc/apt/sources.list
$ echo 'APT::Default-Release "stable";' | sudo tee -a /etc/apt/apt.conf.d/00local
$ sudo apt update 
$ sudo apt -t testing install python3.6
$ pip install --upgrade pip
```
### 安装EH Forwarder Bot
>安装依赖
```
$ sudo apt install ffmpeg
$ pip3 install libmagic pillow
```
安装EFB
```
$ pip3 install ehforwarderbot
```
在家目录下面创建一个.ehforwarderbot文件夹，并赋予所有用户可读和可执行权限
```
$ mkdir ~/.ehforwarderbot
$ chmod -R 775 .ehforwarderbot
```
安装主channel：Telegram
```
$ pip3 install efb-telegram-master
```
安装wechat channel
```
$ pips install efb-wechat-slave
```
### 创建bot
>在Telegram里面唤起BotFather创建一个新的bot
```
1. /start
2. /newbot # 会生成一个token
3. /setprivacy # 设置为'Disable' - your bot will receive all messages that people send to groups.
4. /setjoingroups # 'Enable' - bot can be added to groups.
5. /setcommands 添加以下命令及描述：
    link - 将会话绑定到 Telegram 群组
    chat - 生成会话头
    recog - 回复语音消息以进行识别
    extra - 获取更多功能
6. @get_id_bot 使用他帮你查询一下bot ID
```
### 配置文件
#### EFB默认文件结构
```
./ehforwarderbot                or $EFB_DATA_PATH/username
|- profiles
|  |- default                   The default profile.
|  |  |- config.yaml            Main configuration file.
|  |  |- dummy_ch_master        Directory for data of the channel
|  |  |  |- config.yaml         Config file of the channel. (example)
|  |  |  |- ...
|  |  |- random_ch_slave
|  |  |  |- ...
|  |- profile2                  Alternative profile
|  |  |- config.yaml
|  |  |- ...
|  |- ...
|- modules                      Place for source code of your own channels/middlewares
|  |- random_ch_mod_slave       Channels here have a higher priority while importing
|  |  |- __init__.py
|  |  |- ...
```
#### 创建Telegram和wechat profile
```
# 创建 Telegram profile
$ mkdir profiles/blueset.telegram
$ touch profiles/blueset.telegram/config.yaml

# 创建微信 profile
$ mkdir profiles/blueset.wechat
$ touch profiles/blueset.wechat/config.yaml
```
```vim .ehforwarderbot/profiles/blueset.telegram/config.yaml```: 
```
token: "698***62:AAEG8tR***UWU" // 此处输入你在Telegram BotFather里面获得的token
admins:
- 20***7  // 此处输入你的机器人Id
```
```vim .ehforwarderbot/profiles/blueset.wechat/config.yaml:```
```
flags:  
    option_one: 10  
    option_two: false  
    option_three: "foobar"
```
#### 引入配置
在Default的config.yaml 里面引入Telegram和微信:  
```vim .ehforwarderbot/profiles/default/config.yaml```
```
token: "6***262:AA***nUWU"
admins:
- 20***7

master_channel: "blueset.telegram"
slave_channels:
- "blueset.wechat"
```
#### 启动EFB
```
$ python3 -m ehforwarderbot &
```
