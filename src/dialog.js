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
    if (Vue.prototype.$isServer) {
      return
    }

    // create dialog
    let Component = this._component
    if (typeof Component === 'object' && !Component.options) {
      Component = Vue.extend({ ...this._component })
    }
    // add primary key mixin
    if (Component.options.primaryKey) {
      Component = Component.extend({ mixins: [ Recordable ] })
    }
    if (this.hasAsyncPreload) {
      await ensureComponentAsyncData(Component, { ...this.context, params })
    }
    // create layout
    let LayoutCtor = Vue.extend({
      mixins: [ Layoutable ],
      components: {
        'dialog-child': Component
      }
    })
    LayoutCtor = LayoutCtor.extend(this._layout.component)

    Component.options.inheritAttrs = false

    const layout = new LayoutCtor(merge({
      propsData: { ...this._layout.options, ...params }
    }, this.context, options))

    layout.$mount()
    const dialog = layout.$refs.dialog
    // if (!dialog) {
    //   throw Error('You heave to provide dialog-child component in layout: <dialog-child v-bind="$options.propsData" ref="dialog" />')
    // }

    layout.$on('hook:destroyed', this._onDestroyed.bind(this))
    layout.$on('submit', this.onReturn.bind(this))
    dialog && dialog.$on('submit', this.onReturn.bind(this))

    this._vm = layout
    this._vm._dialogInstance = dialog
    this._vmDialog = dialog
    this.container = options.container ? (findContainer(options.container)) : this.container
    this.container.appendChild(this.element)
    return this
  }

  wait () {
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
