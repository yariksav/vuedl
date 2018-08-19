/*
 * @vdialog/vdialog
 *
 * (c) Savaryn Yaroslav <yariksav@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import Dialog from './dialog';
import Overlay from './overlay';
import { sanitizeComponent } from './utils';

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
      return target.createWrapper(name)
    }

    return target[name]
  }
}

export default class DialogManager {

  constructor ({ context, container } = {}) {
    this._context = context || {}
    Dialog.prototype.context = context || {}
    this._components = {}
    this._overlay = new Overlay()
    this._layouts = {}
    this._overlays = {}
    this._container = container
    return new Proxy(this, proxyHandler)
  }

  get context () {
    return this._context
  }

  layout (name, component) {
    if (component === undefined) {
      return this._layouts[name]
    }
    this._layouts[name] = component
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

  register (name, component, options) {
    if (this[name]) {
      throw Error(`Name "${name}" is reserved in dialog`)
    }
    this._components[name] = { component, options: options || {} }
  }

  create (component) {
    const wrapper = component.layout && this._layouts[component.layout]
    return new Dialog(component, {
      wrapper,
      context: this._context,
      container: this._container
    })
  }

  async show (component, options = {}) {
    const dlg = this.create(component)

    if (!dlg.needOverlay) {
      return await dlg.show(options)
    }

    const overlay = component.overlay || 'default'
    this.overlay(overlay).show()
    try {
      let ret = await dlg.show(options)
      this.overlay(overlay).hide()
      return ret 
    } catch (e) {
      this.overlay(overlay).hide()
      throw e
    }
  }

  createWrapper (name) {
    const cmp = this.getComponent(name)
    return (options) => {
      return this.show(cmp.component, Object.assign({}, cmp.options || {}, options))
    }
  }

  async showAndWait (component, props) {
    const dlg = await this.show(component, props)
    return dlg.wait()
  }

  confirm (message, title, { buttons, width = 400, type } = {}) {
    if (!buttons) {
      buttons = {
        'false': 'Cancel',
        'true': 'OK'
      }
    }
    const cmp = this.getComponent('Confirm')

    return this.showAndWait(cmp.component, {
      title, message, buttons, width, type,
      persistent: true
    })
  }

  warning (title, message, { buttons } = {}) {
    return this.confirm(title, message, { buttons, type: 'warning' })
  }

  error (message, { title, buttons, width } = {}) {
    if (!buttons) {
      buttons = [
        'OK'
      ]
    }
    return this.confirm(message, title, { buttons, width, type: 'error' })
  }

}
