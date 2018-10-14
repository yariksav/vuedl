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
import {
  ensureAsyncDatas,
  destroyVueElement,
  findContainer
} from './utils'

// import Debug from 'debug'
// const debug = Debug('vuedl:dialog')

let seed = 1
export default class Dialog {
  constructor (component, { layout, container } = {}) {
    if (!component) {
      throw Error('Component was not setted')
    }
    this._layout = layout || {component: DefaultLayout, options: {}}
    this._component = component
    this._vm = null
    this._vmDialog = null
    this._options = {}
    this.id = ++seed
    this._resolvers = []
    this.container = findContainer(container)
    // debug('created')
  }

  async show (params = {}, options = {}) {
    if (Vue.prototype.$isServer) return
    // debug('before show', { params, options })

    // create layout
    let LayoutCtor = Vue.extend({
      mixins: [ Layoutable ]
    })
    LayoutCtor = LayoutCtor.extend(this._layout.component)

    const layout = new LayoutCtor(merge({
      propsData: { ...this._layout.options, ...params }
    }, this.context, options))

    // create dialog
    let DialogCtor = Vue.extend({ ...this._component, parent: layout })
    if (this._component.primaryKey) {
      DialogCtor = DialogCtor.extend({ mixins: [ Recordable ] })
    }

    if (this.hasAsyncPreload) {
      // let res =
      await ensureAsyncDatas(DialogCtor, { ...this.context, params })
      // debug('async datas', res)
    }

    const dialog = new DialogCtor(merge({ propsData: params }, this.context, options))

    // mounting
    dialog.$mount()
    layout.$slots.default = dialog._vnode
    layout.$mount()

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
    // debug('remove')
    this.onDestroyed && this.onDestroyed(this)
    // this.element.parentNode.removeChild(this.element)
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
    // debug('processResultPromises', result)
    this._resolvers.forEach(resolver => resolver(result))
    this._resolvers = []
  }

  onReturn (result) {
    // debug('onReturn', result)
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
