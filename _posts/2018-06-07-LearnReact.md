---
layout: post
title: "React循序渐进"
date:  2018-06-07 15:08:00 +0800
categories: Dunndee update
tags: React
---

* TOC
{:toc}

### React
#### 什么是React
>React可以非常轻松的创建用户交互界面，在数据变更时可以高效的重新渲染页面。官方代码示例：  
```javascript
import React from 'react'
import ReactDOM from 'react-dom'
class HelloMessage extends React.Component {
  render() {
    return (
      <div>
      Hello {this.props.name}
      </div>
    )
  }
}
ReactDOM.render(
  <HelloMessage name={'Dundee'} />,
  document.getElementById('root')
)
```
>运行该组件页面上为现实：*Hello Dundee*  
<code>render()</code>方法是组件必须有的部分，编写好的React元素最终通过该方法渲染到页面的DOM中，
当组件状态发生变化时最终通过该方法重新渲染页面。

#### props & state
>在之前代码中已经和<code>props</code>见过面了，调用一个组件时可以在其代码内添加key={value}形式传递组件的属性。在后续的使用中
可能还会遇到形如<code><ComponentName {...PropsName} /></code>引入组件，这里<code>{...PropsName}</code> 使用的是ES6的展开语法，
他会像往一个函数里面传参一样最终会展开以key-value的形式对组件的props进行赋值。  
  说起<code>state</code>应该介绍一下React的构造函数<code>constructor(props)</code>
React组件的构造函数将会在装配之前被调用。当为一个React.Component子类定义构造函数时，你应该在任何其他的表达式之前调用
<code>super(props)</code>。否则，<code>this.props</code>在构造函数中将是未定义，并可能引发异常。更新state使用```setState()```方法，
<code>setState()</code>被认为是一次更新请求未必会立即更新组件，这里需要了解React的生命周期其中有一个方法决定组件是否更新：
<code>shouldComponentUpdate()</code>，我们也可以使用setState的回调来让组件重新渲染：
```javascript
this.setState((prevState, props) => {
  return {counter: prevState.counter + props.step};
});
```

#### React 生命周期
>Mounting:  
```
getInitialState => componentWillMount => render => componentDidMount
```
______
>Updating:  
```
componentWillReceiveProps => shouldComponentUpdate => componentWillUpdate => render => componetDidUpdate
```
______
>Unmounting:  
``` 
componentWillUnmount
```

### Redux 状态管理
>Redux 最简单的、最核心的：***Store***、***Action***、***Reducer***.  
1. 整个应用只有一个store。
2. State只能通过触发Action(<code>store.dispatch('ADD')</code> 即可触发)来更新，此时只是说明了动机并没有真正的更新state。
3. 在Reducer里面更新state，理念：<code>(oldState, action) => newState</code>，使用纯函数。
4. Action包含两个参数(type, payload), type一般使用常量，用来标识动作类型， payload标识动作携带的数据。  
官网对redux的极简描绘：
```javascript
import { createStore } from 'redux'
​
/**
 * This is a reducer, a pure function with (state, action) => state signature.
 * It describes how an action transforms the state into the next state.
 *
 * The shape of the state is up to you: it can be a primitive, an array, an object,
 * or even an Immutable.js data structure. The only important part is that you should
 * not mutate the state object, but return a new object if the state changes.
 *
 * In this example, we use a `switch` statement and strings, but you can use a helper that
 * follows a different convention (such as function maps) if it makes sense for your
 * project.
 */
function counter(state = 0, action) {
  switch (action.type) {
  case 'INCREMENT':
    return state + 1
  case 'DECREMENT':
    return state - 1
  default:
    return state
  }
}
​
// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
let store = createStore(counter)
​
// You can use subscribe() to update the UI in response to state changes.
// Normally you'd use a view binding library (e.g. React Redux) rather than subscribe() directly.
// However it can also be handy to persist the current state in the localStorage.
​
store.subscribe(() =>
  console.log(store.getState())
)
​
// The only way to mutate the internal state is to dispatch an action.
// The actions can be serialized, logged or stored and later replayed.
store.dispatch({ type: 'INCREMENT' })
// 1
store.dispatch({ type: 'INCREMENT' })
// 2
store.dispatch({ type: 'DECREMENT' })
// 1
```
### Redux-saga 异步
