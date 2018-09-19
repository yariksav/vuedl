/*
 * vuedl
 *
 * (c) Savaryn Yaroslav <yariksav@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import Vue from 'vue'
import Dialog from './dialog'
import Overlay from './overlay'
// import Notification from './notification'

const proxyHandler = {

  get (target, name) {
    /**
     * if node is inspecting then stick to target properties
     */
    if (typeof (name) === 'symbol' || name === 'inspect') {
      return target[name]
    }

    if (target[name]) {
      return target[name]
    }

    if (target._components[name]) {
      return target.createFunctionWrapper(name)
    }

    return target[name]
  }
}

export default class DialogManager {
  constructor ({ context, container } = {}) {
    this._context = context || {}
    Dialog.prototype.context = context || {}
    this._components = {}
    this._layouts = {}
    this._overlays = {}
    this._container = container
    this._emitter = new Vue({})
    this._instances = []
    // this.initEmitter()
    return new Proxy(this, proxyHandler)
  }

  // initEmitter () {
  //   this._emitter.$on('shown', ({ dialog }) => {
  //     const position = dialog.vm.position
  //     let verticalOffset = notificationGap
  //     this._instances.filter(item => item.vm.position === position).forEach(item => {
  //       verticalOffset += item.element.offsetHeight + notificationGap
  //     })
  //     this._instances.push(dialog)
  //     dialog.vm.verticalOffset = verticalOffset
  //   })

  //   this._emitter.$on('destroyed', ({ dialog }) => {
  //     let index = this._instances.findIndex(instance => instance.id === dialog.id)
  //     if (index < 0) {
  //       return
  //     }
  //     this._instances.splice(index, 1)
  //     // console.log('instances', this._instances)

  //     const len = this._instances.length
  //     const position = dialog.vm.position
  //     if (!len) return

  //     let verticalOffset = notificationGap
  //     this._instances.filter(item => item.vm.position === position).forEach(item => {
  //       item.vm.verticalOffset = verticalOffset
  //       verticalOffset += item.element.offsetHeight + notificationGap
  //     })
  //   })
  // }

  get context () {
    return this._context
  }

  layout (name, component, options = {}) {
    this._layouts[name] = { component, options }
  }

  getLayout (layout) {
    if (typeof layout === 'function') {
      let options = layout.call(this)
      layout = this._layouts[options.name || 'default']
      return { ...layout, ...{ options } }
    }

    if (typeof layout === 'object' && typeof layout.render === 'function') {
      return { component: layout }
    }

    if (Array.isArray(layout)) {
      const nameTmp = layout[0]
      const optionsTmp = layout[1] || {}
      const instance =
        (typeof nameTmp === 'object' && typeof nameTmp.render === 'function')
          ? { component: nameTmp }
          : this._layouts[nameTmp]
      return instance && {
        component: instance.component,
        options: { ...instance.options, ...optionsTmp }
      }
    }
    return this._layouts[layout]
  }

  overlay (name, component) {
    if (component === undefined) {
      if (this._overlays[name]) {
        return this._overlays[name]
      } else {
        throw new Error(`Overlay "${name} not found
          Please register it by calling dialog.overlay('${name}', component)`)
      }
    }
    this._overlays[name] = new Overlay(component)
  }

  getComponent (name) {
    if (!this._components[name]) {
      throw new Error(`Component "${name}" was not found.
        Please register it by calling dialog.register('${name}', component)`)
    }
    return this._components[name]
  }

  component (name, component, options = {}) {
    if (component === undefined) {
      return this._components[name]
    }
    this._components[name] = { component, options }
  }

  create (component) {
    if (!component) {
      throw new Error('Component is incorrect')
    }

    const layout = this.getLayout(component.layout || 'default')
    const dlg = new Dialog(component, {
      layout,
      context: this._context,
      container: this._container
    })
    this._emitter.$emit('created', { dialog: dlg })
    return dlg
  }

  async show (component, options = {}) {
    const dlg = this.create(component)
    const overlayName = dlg.hasAsyncPreload ? (component.overlay || 'default') : false
    const overlay = overlayName && this._overlays[overlayName] && this.overlay(overlayName)

    overlay && overlay.show()
    try {
      await dlg.show(options)
      this._emitter.$emit('shown', { dialog: dlg })
      overlay && overlay.hide()
      dlg.onDestroyed = this.onDialogDestroyed.bind(this)
      return options.waitForResult ? dlg.wait() : dlg
    } catch (e) {
      this._emitter.$emit('error', { error: e, dialog: dlg })
      overlay && overlay.hide()
      throw e
    }
  }

  createFunctionWrapper (name) {
    const cmp = this.getComponent(name)
    return (options) => {
      return this.show(cmp.component, { ...cmp.options, ...options })
    }
  }

  async showAndWait (component, props) {
    const dlg = await this.show(component, props)
    return dlg.wait()
  }

  on (event, callback) {
    this._emitter.$on(event, callback)
  }

  off (event, callback) {
    this._emitter.$off(event, callback)
  }

  once (event, callback) {
    this._emitter.$once(event, callback)
  }

  onDialogDestroyed (dialog) {
    this._emitter.$emit('destroyed', { dialog })
  }
}
