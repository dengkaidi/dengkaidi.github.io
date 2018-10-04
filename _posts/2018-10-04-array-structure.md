---
title: 数组
layout: post
category:
- 编程
- 数据结构
tags:
- Java
date: 2018-10-04 11:12:00 +0800
---

* TOC
{:toc}

### 数组的特效
1. 数组是数据结构中最常见的一种线性表。线性表结构还包含：链表、队列、栈等。
2. 数组的存储需要一块连续的内存空间。根据第一个数组元素的位置、已知的每个数据占内存大小（偏移量），可以
计算出任意元素所在内存地址。```arr[i]_addr = arr[0]_addr + i * per_size```
3. 数组查找元素的时间复杂度为O(n)，而根据下标访问元素的时间复杂度为O(1)。
4. 因为需要一块连续的地址存储数组，所以在数组的插入和删除最坏情况情况，需要移动整个数组的内存地址。所以数组不适于频繁删除和插入的场景中。

### ArrayList
Java提供了一个很常用的数组容器：ArrayList。
- ArrayList 无法存储基本数据类型，在存储时会进行装箱(Autoboxing)、读取时进行拆箱(Unboxing)。考虑性能最好使用数组：
```java
    int arr[] = new int[]{1, 2};
    int[] arr1 = new int[10];
    int arr2[] = {1, 2};
```

### 代码
```java
public class Array {
    private int data[];
    private int capacity;
    private int count;

    public Array(int capacity) {
        data = new int[capacity];
        this.capacity = capacity;
        count = 0;
    }

    public int find(int index) {
        if (index < 0 || index >= count) {
            return -1;
        }
        return data[index];
    }

    public boolean add(int index, int value) {
        if (index < 0 || index >= count ) {
            return false;
        }
        // 不支持动态扩容
        if (count == capacity) {
            return false;
        }
        // 将数组往后移动
        for (int i = count; i > index; i--) {
            data[i+1] = data[i];
        }
        data[index] = value;
        ++count;
        return true;
    }

    public boolean delete(int index) {
        if (index < 0 || index >= count) {
            return false;
        }
        for (int i = index + 1; i >= count ; i++) {
            data[i-1] = data[i];
        }
        --count;
        return true;
    }
}
```