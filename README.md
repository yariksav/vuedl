# Vuedl - vue dialog helper

This module will help you to work with modal dialogs in your project

Inspire of Nuxt.js logic, **vuedl** also has `asyncData`, `fetch`, `layout` and `middleware` handlers

> NOTE: Module is in initial development. Anything may change at any time.

[![NPM Version][npm-image]][npm-url]

<!-- ## Demo page -->
<!-- [See demo here](https://yariksav.github.io/demo_vuedl.html) -->
## Setup

Install the package from npm

```npm
npm install vuedl
```

```javascript
import vuedl from 'vuedl'
Vue.use(vuedl, {
  context,
  property
})
```

Where
-- `context`: is object with context of your application, such as i18n, store, router, etc
-- `property`: is name of Vue property, for access, default is `$dialog`

After instalation, instance of dialog manager will be available in Vue.prototype.$dialog, or inside Vue instances this.$dialog

## Usage

### Use dialogs

```js
import MyDialog from './MyDialog'

const dialog = await this.$dialog.show(MyDialog, params, options)
```
`dialog` will be instance of DialogManager

### Register anduse global dialog

Register global dialog component, which will be available in any vue module
```javascript
Vue.prototype.$dialog.register('myDialog', MyDialog)
```
Then you can use it in any code
```javascript
this.$dialog.myDialog(params, options)
```

### Waiting for user fiil data and click button (when dialog is closing)
```js
const result = await this.$dialog.showAndWait(MyDialog, params)
```
or
```js
const dialog = await this.$dialog.show(MyDialog, params)
const result = dialog.wait()
```
`result` will be object of user inputs, or clicked button, depending on what will be sent in dialog component by the:

```js
this.$emit('submit', inputs)
```

## The layout param

**vuedl** can use layout templates for wrapping dialogs
For registering your own layouts template use
```javascript
Vue.prototype.$dialog.layout('default', MyLayout)
```

Example of the layout template
```html
  <v-dialog v-model="isActive" :max-width="width">
    <slot/>
  </v-dialog>
```
**vuedl** module will put in layout component mixin with params:

-- `width`: Number - max width of component
-- `isActive`: Boolean - is dialog active
-- `show`: Function
-- `close`: Function

If dialog showed without layout, this mixin will integrate to dialog instance

After this dialog component must have parameter
```js
{
  layout: 'default'
  ...
}
```

## The asyncData and fetch Method

Sometimes you just want to fetch data and pre-render it on the server without using a store. `asyncData` is called every time before loading the dialog component. This method receives [the context] as the first argument, you can use it to fetch some data and v-dialog will merge it with the component data.

> You do **NOT** have access of the component instance through `this` inside `asyncData` because it is called **before initiating** the component

v-dialog offers you different ways to use `asyncData`. Choose the one you're the most familiar with:

`fetch` is use for calling store methods, and not impact to instance data

1. Returning a `Promise`. v-dialog will wait for the promise to be resolved before rendering the component.
2. Using the [async/await proposal](https://github.com/lukehoban/ecmascript-asyncawait) ([learn more about it](https://zeit.co/blog/async-and-await))
3. Define a callback as second argument. It has to be called like this: `callback(err, data)`

### Returning a Promise

```js
export default {
  asyncData ({ params }) {
    return axios.get(`https://my-api/posts/${params.id}`)
    .then((res) => {
      return { title: res.data.title }
    })
  }
}
```

### Using async/await

```js
export default {
  async asyncData ({ params }) {
    let { data } = await axios.get(`https://my-api/posts/${params.id}`)
    return { title: data.title }
  }
}
```

### Using a callback

```js
export default {
  asyncData ({ params }, callback) {
    axios.get(`https://my-api/posts/${params.id}`)
    .then((res) => {
      callback(null, { title: res.data.title })
    })
  }
}
```

### Displaying the data

The result from asyncData will be **merged** with data.
You can display the data inside your template like you're used to doing:

```html
<template>
  <h1>{{ title }}</h1>
</template>
```

## The overlay

When dialog component has an `asyncData` or `fetch` functions, it will show overlay before calling this methods. Overlay will block main window and show loading cursor.

If you want to register your own overlays template
```javascript
Vue.prototype.$dialog.overlay('default', MyOverlay)
```

## Confirm, alert and prompt dialogs
**vuedl** has implementations of confirm, alert warning, error or prompt dialog

```js
this.$dialog.confirm('Do you really want to exit?').then(res => {
})
```
```js
const res = await this.$dialog.warning('Do you really want to exit?')
...
const res = await this.$dialog.error('Do you really want to exit?')
```

```js
let res = await this.$dialog.confirm('Do you really want to exit?', {title: 'Warning'})
if (res) {
  ...
}
```
*res* will be true or false

You can format your message with arbitrary HTML - make sure you don't include any user-provided content here:

```js
this.$dialog.confirm('Please do not do this.<br>Do you really want to exit?'}).then(res => {
})
```

For registering own Confirm template 
```javascript
Vue.prototype.$dialog.component('Confirm', MyConfirmDialog)
```

For registering own Prompt template 
```javascript
Vue.prototype.$dialog.component('Prompt', MyPromptDialog)
```

[npm-image]: https://img.shields.io/npm/v/vuedl.svg?style=flat-square&logo=npm
[npm-url]: https://npmjs.org/package/vuedl
