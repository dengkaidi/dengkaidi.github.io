---
layout: post
title: "String to List"
date: 2017-09-28 21:51:05 +0800
categories: Raspberry commit 
tags: Java Code
---

* TOC
{:toc}

## String to List
>
```java
    String str = "Hello";
    Sting[] strList = str.split(" ");
    System.out.println("String str to List: " + strList[0]);
```

## String[] to List\<String>
>
```java
    String[] name = {"Tom", "Jack"};
    List<String> listStr = new ArrayList<String>();
    listStr.add(name[0]);
```

## List<Object[]> To String
{% highlight java %}
    List<Object[]> ResultList = new ArrayList<Objec[]>();
    //遞歸查詢屬於同一部門下面的員工ID 
    String Query = "select ID from emp_group start with ID = '0001' connect by nocycle prior ID = PARENTID";
    ResultList = super.getRowList(Query);

    StringBuilder params = new StringBuilder();
    
    // To eg: '0001','0002','003'
    for(int i = 0; i < ResultList.size(); i++) {
        params.append("'");
        params.append(ResultList.get(i)[0]);
        params.append("'");
        // add "," 
        if ( i != ResultList() - 1) {
            params.append(",");
        }
    }
{% endhighlight %}
## String to int
>
```java
    int num = Integer.valueOf(rs.getString(1)).intValue; 
    // This function may throw NumberFormatException 
    int num2 = Integer.parseInt(StringName);
```
