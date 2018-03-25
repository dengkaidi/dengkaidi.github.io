---
layout: post
title:  SQL 平时总结
date: 2018-03-25 19:04:28 +0800
categories: Company update
tags: Oracle  
---

* TOC
{:toc}

## 通过SQL语句将元转化为万元

```
/**通过SQL实现小于一万时展示数据库里面的数据，大于一万时转化为万元**/
select decode(sign(money - 10000),-1,
money || ' 元',
round(trunc(money / 10000, 3), 2) || ' 万元') as money 
from dual;
```

## 多列转一行
```
SELECT caa.objectId,listagg(C.id, '||') WITHIN GROUP(ORDER BY caa.objectId) as collateralIds
  FROM COLLATERAL C  left join collateral_amount_assign caa
  on caa.valid = '1' WHERE 1=1 GROUP BY caa.objectId
```