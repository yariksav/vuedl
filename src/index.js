/*
 * vuedl
 *
 * (c) Savaryn Yaroslav <yariksav@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import DialogManager from './manager'
import _Actionable from './mixins/actionable'
import _Activable from './mixins/activable'
import _Confirmable from './mixins/confirmable'
import _Notifiable from './mixins/notifiable'
import _Recordable from './mixins/recordable'
import _Returnable from './mixins/returnable'

export function install (Vue, options = {}) {
  const property = options.property || '$dialog'
  const manager = new DialogManager(options)

  Object.defineProperty(Vue.prototype, property, {
    get () {
      return manager
    }
  })
}

export const Actionable = _Actionable
export const Activable = _Activable
export const Confirmable = _Confirmable
export const Notifiable = _Notifiable
export const Recordable = _Recordable
export const Returnable = _Returnable

// Auto-install
let GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue
}
if (GlobalVue) {
  GlobalVue.use({
    install
  })
}
