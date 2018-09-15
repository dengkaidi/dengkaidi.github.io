---
layout: post
title:  "代码高亮设置案例"
date:   2016-11-30 14:31:00 +0800
categories: 编程
tags: markdown
---

* TOC
{: toc}

## JavaScript高亮
This javascript will validate/allow the number only when event key is pressed.
For example result of it:

<iframe width="100%" height="350" src="//jsfiddle.net/agaust/3qz105nn/embedded/html,result/dark/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

tutorial above, when you can not directly add the attribute inside html tag.
but if you can add it, you can following this tutorial bellow:

{% highlight html %}
<input id="id_price" type="number" min=0 onkeypress="return isNumber(event)"/>
<script type="text/javascript">
function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}
</script>
{% endhighlight %}

**Refference:** [http://stackoverflow.com/a/7295864](http://stackoverflow.com/a/7295864)

## Java高亮
{% highlight java %}
public class static main(String[] args){
	System.out.println("Hello World!\n");
}
{% endhighlight %}

## C语言高亮
```c
#include <stdio.h>
int main()
{
	printf("Hello world!\n");

	return 0;
}
```
