---
layout: post
title: SQL日常笔记
date: 2018-03-25 17:55:00 +0800
categories: SQL
tags: Oracle
---

* TOC
{:toc}

## 通过SQL实现将单位转换

```
/**通过SQL实现小于一万时展示数据库里面的数据，大于一万时转化为万元**/
select decode(sign(money - 10000), -1,
money || '元',
round(trunc(money / 10000, 3), 2) || '万元') as money from dual;
```
## 多列转一行
```
select caa.objectId, listagg(c.Id,'||') with group (order by caa.objectId) as Ids
from collateral c left join collateral_amount_assign caa
on caa.calid = '1' caa.xx= c.projectId group by caa.objectId
```

