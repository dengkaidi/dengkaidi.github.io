---
layout: post
title: "React & Redux"
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
```
   
><code>ReactDOM.render調用 HelloMessage name="React" </code>组件页面展示：*Hello React*  
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
<code>shouldComponentUpdate()</code>，我们也可以使用setState的回调来让组件重新渲染:  
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
>Redux是用于帮助React管理data-state和UI-state的工具。  
Redux 最简单的、最核心的：***Store***、***Action***、***Reducer***.  
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
><code>Redux-saga</code>用于管理异步执行的中间件（使用ES6的新特性：Generator）。
#### Generator介绍
>语法：（function* func() { ... }）***生成器函数在执行时能暂停，后面又能从暂停处继续执行。***
调用一个生成器函数并不会马上执行它里面的语句，而是返回一个这个生成器的 迭代器 （iterator）对象。
当这个迭代器的 next() 方法被首次（后续）调用时，其内的语句会执行到第一个
（后续）出现yield的位置为止，yield 后紧跟迭代器要返回的值。或者如果用的是
 yield*（多了个星号），则表示将执行权移交给另一个生成器函数（当前生成器暂停执行）。
next()方法返回一个对象，这个对象包含两个属性：value 和 done，value 属性表示本次
 yield 表达式的返回值，done 属性为布尔类型，表示生成器后续是否还有 yield 语句，
 即生成器函数是否已经执行完毕并返回。
 #### redux何处使用saga
 >Redux大致执行过程：
 1. store持有应用不可变的state。
 2. render进行UI渲染。
 3. Component组件触发Action。
 4. reducer 根据store提供的action信息生成新的state
 5. saga异步处理
 6. 返回1
 >官方示例：
 假设我们有一个 UI 界面，在单击按钮时从远程服务器获取一些用户数据。
 ```javascript
class UserComponent extends React.Component {
  ...
  onSomeButtonClicked() {
    const { userId, dispatch } = this.props
    dispatch({type: 'USER_FETCH_REQUESTED', payload: {userId}})
  }
  ...
}
```
>创建一个 Saga 来监听所有的 USER_FETCH_REQUESTED action，并触发一个 API 调用获取用户数据:
```javascript
// worker Saga : 将在 USER_FETCH_REQUESTED action 被 dispatch 时调用
function* fetchUser(action) {
   try {
      const user = yield call(Api.fetchUser, action.payload.userId);
      yield put({type: "USER_FETCH_SUCCEEDED", user: user});
   } catch (e) {
      yield put({type: "USER_FETCH_FAILED", message: e.message});
   }
}
/*
  在每个 `USER_FETCH_REQUESTED` action 被 dispatch 时调用 fetchUser
  允许并发（译注：即同时处理多个相同的 action）
*/
function* mySaga() {
  yield takeEvery("USER_FETCH_REQUESTED", fetchUser);
}
```