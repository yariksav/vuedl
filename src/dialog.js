import Vue from 'vue'
import DialogMixin from './mixins/dialog'
import WrapperMixin from './mixins/wrapper'
import merge from 'lodash/merge'

import {
  sanitizeComponent,
  ensureAsyncDatas,
  destroyVueElement,
  findContainer
} from './utils'

export default class Dialog {

  constructor (component, { wrapper, container } = {}) {
    if (!component) {
      throw Error('Component was not sended')
    }
    this._wrapper = wrapper
    this._component = component
    this._vm = null
    this._vmDialog = null
    this._options = {}
    this._resolvers = []
    this.container = findContainer(container)
  }

  async show (params = {}, options = {}) {

    let Ctor
    if (this._wrapper) {
      const DialogCtor = sanitizeComponent(merge({
        mixins: [DialogMixin]
      }, this._component))

      await ensureAsyncDatas(DialogCtor, Object.assign({ params }, this.context))

      Ctor = Vue.extend(merge({
        components: {
          'dialog-child': DialogCtor
        },
        mixins: [WrapperMixin],
        destroyed: this.onDestroyed.bind(this)
      }, this._wrapper))
    } else {
      Ctor = sanitizeComponent(merge({
        mixins: [DialogMixin, WrapperMixin],
        destroyed: this.onDestroyed.bind(this)
      }, this._component))

      await ensureAsyncDatas(Ctor, this.context)
    }

    this._vm = new Ctor(merge({ propsData: params }, this.context, options))
    this._vm.$mount()
    this._vmDialog = this._vm.$refs.dialog || this._vm
    this._vmDialog.$on('result', this.onResult.bind(this))
    this._vmDialog.$on('close', this.onClose.bind(this))

    const container = options.container ? (findContainer(options.container)) : this.container
    container.appendChild(this.element)

    this._vm.show()
    return this
  }

  wait () {
    if (!this.showed) {
      return Promise.reject('Dialog was closed or not showed')
    }
    return new Promise(resolve => {
      this._resolvers.push(resolve)
    })
  }

  remove () {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element)
    }
    destroyVueElement(this._vm)
    destroyVueElement(this._vmDialog)
    if (this._resolvers.length) {
      this._processResultPromises()
    }
    this._vm = null
    this._vmDialog = null
  }

  _processResultPromises () {
    this._resolvers.forEach(resolver => resolver(this.result))
    this._resolvers = []
  }

  onDestroyed () {
    this.remove()
  }

  onResult (result) {
    this.result = result
  }

  onClose (result) {
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