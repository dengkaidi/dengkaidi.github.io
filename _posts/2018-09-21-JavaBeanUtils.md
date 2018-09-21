---
layout: post
title: JavaBean与Map的转换
tags: Java
date:   2018-09-21 14:31:00 +0800
categories: 编程
---

* TOC
{:toc}

### JavaBean转Map
```java
    /**
     * 将一个Bean转换为一个Map
     *
     * @param bean 需要进行转换的类
     * @return 返回一个Map
     * @throws IntrospectionException
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     */
    public Map<String, Object> Bean2Map(Object bean) throws IntrospectionException, InvocationTargetException, IllegalAccessException {
        if (null == bean) {
            return null;
        }
        HashMap<String, Object> resultMap = new HashMap();

        Class<?> aClass = bean.getClass();
        // 分析javaBean 并拿到它的属性、方法和事件等信息
        BeanInfo beanInfo = Introspector.getBeanInfo(aClass);

        // 获取一个bean的所有属性
        PropertyDescriptor[] propertyDescriptors = beanInfo.getPropertyDescriptors();

        for (PropertyDescriptor propertyDescriptor : propertyDescriptors) {
            // 获取属性名称
            String propertyDescriptorName = propertyDescriptor.getName();

            if (!"class".equals(propertyDescriptorName)) {
                Method readMethod = propertyDescriptor.getReadMethod();
                Object value = readMethod.invoke(bean, new Object[0]);
                // 将属性和值，以key-value形式存入Map
                resultMap.put(propertyDescriptorName, value);
            }
        }
        return resultMap;
    }
```
