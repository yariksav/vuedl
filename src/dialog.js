/*
 * vuedl
 *
 * (c) Savaryn Yaroslav <yariksav@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue'
import Recordable from './mixins/recordable'
import Layoutable from './mixins/layoutable'

import merge from 'lodash/merge'
import DefaultLayout from './components/DefaultLayout.vue'
import { ensureComponentAsyncData, hasAsyncPreload } from 'vue-asyncable'
import {
  destroyVueElement,
  findContainer
} from './utils'

let seed = 1
export default class Dialog {
  constructor (component, { layout, container } = {}) {
    if (!component) {
      throw Error('Component was not setted')
    }
    this._layout = layout || { component: DefaultLayout, options: {} }
    this._component = component
    this._vm = null
    this._vmDialog = null
    this._options = {}
    this.id = ++seed
    this._resolvers = []
    this.container = findContainer(container)
  }

  async show (params = {}, options = {}) {
    if (Vue.prototype.$isServer) return
    // create layout
    let LayoutCtor = Vue.extend({
      mixins: [ Layoutable ]
    })
    LayoutCtor = LayoutCtor.extend(this._layout.component)

    const layout = new LayoutCtor(merge({
      propsData: { ...this._layout.options, ...params }
    }, this.context, options))

    // create dialog
    let Component = this._component
    if (typeof Component === 'object' && !Component.options) {
      Component = Vue.extend({ ...this._component, parent: layout })
    } else {
      Component.options.parent = layout
    }
    // add primary key mixin
    if (Component.options.primaryKey) {
      Component = Component.extend({ mixins: [ Recordable ] })
    }
    if (this.hasAsyncPreload) {
      await ensureComponentAsyncData(Component, { ...this.context, params })
    }

    const dialog = new Component(merge({ propsData: params }, this.context, options))

    // mounting
    dialog.$mount()
    // layout.$slots.default = dialog._vnode
    //   dialog.$on('hook:updated', () => {
    //     layout.$slots.default = dialog._vnode
    //     layout.$forceUpdate()
    //   })
    // }
    layout.$mount()
    const ref = layout.$refs['dialog-instance']
    if (ref) {
      ref.$el ? ref.$el.appendChild(dialog.$el) : ref.appendChild(dialog.$el)
    } else {
      // if (process.env.NODE_ENV !== 'production') {
      //   console.warn('Slot in layouts is deprecated. Please use <div ref="dialog-instance"/> instead')
      // }
      layout.$slots.default = dialog._vnode
    }
    layout.$on('hook:destroyed', this._onDestroyed.bind(this))
    layout.$on('submit', this.onReturn.bind(this))
    dialog.$on('submit', this.onReturn.bind(this))

    this._vm = layout
    this._vm._dialogInstance = dialog
    this._vmDialog = dialog
    this.container = options.container ? (findContainer(options.container)) : this.container
    this.container.appendChild(this.element)
    return this
  }

  wait () {
    // if (!this.showed) {
    //   return Promise.reject(new Error('Dialog was closed or not showed'))
    // }
    return new Promise(resolve => {
      this._resolvers.push(resolve)
    })
  }

  _onDestroyed () {
    this.remove()
  }

  remove () {
    this.onDestroyed && this.onDestroyed(this)
    this._processResultPromises()
    destroyVueElement(this._vm)
    destroyVueElement(this._vmDialog)
    this._vm = null
    this._vmDialog = null
  }

  _processResultPromises (result) {
    if (!this._resolvers.length) {
      return
    }
    this._resolvers.forEach(resolver => resolver(result))
    this._resolvers = []
  }

  onReturn (result) {
    this._processResultPromises(result)
    this.close()
  }

  get showed () {
    return !!this._vm && !this._vm._isDestroyed
  }

  get element () {
    return this._vm && this._vm.$el
  }

  get hasAsyncPreload () {
    return this._component && hasAsyncPreload(this._component.options || this._component)
  }

  get vm () {
    return this._vm
  }

  get vmd () {
    return this._vmDialog
  }

  close () {
    this._vm && this._vm.close()
  }
}
