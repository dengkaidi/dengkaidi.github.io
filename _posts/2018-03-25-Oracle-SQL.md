---
layout: post
title:  SQL ƽʱ�ܽ�
date: 2018-03-25 19:04:28 +0800
categories: Company update
tags: Oracle  
---

* TOC
{:toc}

## ͨ��SQL��佫Ԫת��Ϊ��Ԫ

```
/**ͨ��SQLʵ��С��һ��ʱչʾ���ݿ���������ݣ�����һ��ʱת��Ϊ��Ԫ**/
select decode(sign(money - 10000),-1,
money || ' Ԫ',
round(trunc(money / 10000, 3), 2) || ' ��Ԫ') as money 
from dual;
```

## ����תһ��
```
SELECT caa.objectId,listagg(C.id, '||') WITHIN GROUP(ORDER BY caa.objectId) as collateralIds
  FROM COLLATERAL C  left join collateral_amount_assign caa
  on caa.valid = '1' WHERE 1=1 GROUP BY caa.objectId
```