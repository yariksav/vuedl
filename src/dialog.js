/*
 * vuedl
 *
 * (c) Savaryn Yaroslav <yariksav@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import Vue from 'vue'
import DialogMixin from './mixins/recordable'
import Layoutable from './mixins/layoutable'

import merge from 'lodash/merge'
import DefaultLayout from './components/DefaultLayout.vue'
import {
  ensureAsyncDatas,
  destroyVueElement,
  findContainer
} from './utils'

import Debug from 'debug'
const debug = Debug('vuedl:dialog')

export default class Dialog {
  constructor (component, { layout, container } = {}) {
    if (!component) {
      throw Error('Component was not sended')
    }
    this._layout = layout || {component: DefaultLayout, options: {}}
    this._component = component
    this._vm = null
    this._vmDialog = null
    this._options = {}
    this._resolvers = []
    this.container = findContainer(container)
    debug('created')
  }

  async show (params = {}, options = {}) {
    debug('before show', { params, options })

    const DialogCtor = Vue.extend(merge({
      // inject: ['isActive'],
      mixins: [ DialogMixin ]
    }, this._component))

    if (this.hasAsyncPreload) {
      let res = await ensureAsyncDatas(DialogCtor, { ...this.context, params })
      debug('async datas', res)
    }

    this._vmDialog = new DialogCtor(merge({ propsData: params }, this.context, options))
    this._vmDialog.$mount()

    const wrapperComponent = this._layout.component
    const LayoutCtor = Vue.extend(merge({
      // provide: ['isActive'],
      mixins: [ Layoutable ],
      destroyed: this._onDestroyed.bind(this)
    }, wrapperComponent))

    // get propsData for wrapper
    const propsData = { ...this._layout.options, ...params }
    this._vm = new LayoutCtor(merge({ propsData }, this.context, options))

    this._vm.$slots.default = this._vmDialog._vnode
    this._vmDialog.$parent = this._vm
    // this._vmDialog. = this._vm
    this._vm.$mount()
    this._vmDialog.$on('update:returnValue', this.onReturn.bind(this))

    this.container = options.container ? (findContainer(options.container)) : this.container
    this.container.appendChild(this.element)
    return this
  }

  wait () {
    if (!this.showed) {
      return Promise.reject(new Error('Dialog was closed or not showed'))
    }
    return new Promise(resolve => {
      this._resolvers.push(resolve)
    })
  }

  _onDestroyed () {
    this.remove()
  }

  remove () {
    debug('remove')
    // console.log('remove', this.element.innerHTML)

    // this.element.parentNode.removeChild(this.element)
    this._processResultPromises()
    destroyVueElement(this._vm)
    destroyVueElement(this._vmDialog)
    // this._vm = null
    // this._vmDialog = null
  }

  _processResultPromises (result) {
    if (!this._resolvers.length) {
      return
    }
    debug('processResultPromises', result)
    this._resolvers.forEach(resolver => resolver(result))
    this._resolvers = []
  }

  onReturn (result) {
    console.log('onReturn', result)
    debug('onReturn', result)
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
    return this._component && (this._component.asyncData || this._component.fetch)
  }

  get vm () {
    return this._vm
  }

  get vmd () {
    return this._vmDialog
  }

  close () {
    this._vm.close()
  }
}
