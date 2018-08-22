/*
 * vuedl
 *
 * (c) Savaryn Yaroslav <yariksav@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import Vue from 'vue'
import DialogMixin from './mixins/dialog'
import WrapperMixin from './mixins/wrapper'
import merge from 'lodash/merge'
import DefaultWrapper from './components/DefaultLayout.vue'
import {
  // sanitizeComponent,
  ensureAsyncDatas,
  destroyVueElement,
  findContainer
} from './utils'

import Debug from 'debug'
const debug = Debug('vuedl:dialog')

export default class Dialog {
  constructor (component, { wrapper, container } = {}) {
    if (!component) {
      throw Error('Component was not sended')
    }
    this._wrapper = wrapper || {component: DefaultWrapper, options: {}}
    this._component = component
    this._vm = null
    this._vmDialog = null
    this._options = {}
    this._resolvers = []
    this.container = findContainer(container)
    debug('created')
  }

  async show (params = {}, options = {}) {
    debug('before show', { params, options, wrapper: !!this._wrapper })

    const DialogCtor = Vue.extend(merge({
      mixins: [DialogMixin]
    }, this._component))

    let res = await ensureAsyncDatas(DialogCtor, { ...this.context, params })
    debug('async datas', res)

    const Wrapper = Vue.extend(merge({
      mixins: [WrapperMixin],
      destroyed: this.onDestroyed.bind(this)
    }, this._wrapper.component))

    this._vm = new Wrapper(merge({ propsData: this._wrapper.options }, { propsData: params }, this.context, options))
    this._vmDialog = new DialogCtor(merge({ propsData: params }, this.context, options))

    this._vmDialog.$mount()
    this._vm.$slots.default = this._vmDialog._vnode
    this._vm.$mount()

    this._vmDialog.$on('result', this.onResult.bind(this))
    this._vmDialog.$on('close', this.onClose.bind(this))

    const container = options.container ? (findContainer(options.container)) : this.container
    container.appendChild(this.element)
    debug('append to', container.tagName)
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

  remove () {
    debug('remove')
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element)
    }
    destroyVueElement(this._vm)
    destroyVueElement(this._vmDialog)
    this._processResultPromises()
    this._vm = null
    this._vmDialog = null
  }

  _processResultPromises () {
    if (!this._resolvers.length) {
      return
    }
    debug('processResultPromises', this.result)
    this._resolvers.forEach(resolver => resolver(this.result))
    this._resolvers = []
  }

  onDestroyed () {
    debug('onDestroyed')
    this.remove()
  }

  onResult (result) {
    this.result = result
  }

  onClose (result) {
    debug('onClose', result)
    if (result) {
      this.result = result
    }
    this._processResultPromises()
    this._vm.close()
  }

  get showed () {
    return !!this._vm && !this._vm._isDestroyed
  }

  get element () {
    return this._vm && this._vm.$el
  }

  get needOverlay () {
    return this._component && (this._component.asyncData || this._component.fetch)
  }

  get vm () {
    return this._vm
  }

  close () {
    this._vm.close()
  }
}
