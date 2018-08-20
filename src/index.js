/*
 * vuedl
 *
 * (c) Savaryn Yaroslav <yariksav@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import DialogManager from './manager'
import DialogLayout from './components/DialogLayout.vue'
import DialogOverlay from './components/DialogOverlay.vue'
import Confirm from './components/Confirm.vue'

const Plugin = {
  install (Vue, options = {}) {
    const property = options.property || '$dialog'
    const manager = new DialogManager(options)

    Object.defineProperty(Vue.prototype, property, {
      get () {
        return manager
      }
    })

    manager.layout('default', DialogLayout)
    manager.overlay('default', DialogOverlay)

    manager.template('confirm', Confirm, {
      waitForResult: true,
      buttons: {
        'false': 'Cancel',
        'true': 'OK'
      }
    })

    manager.template('warning', Confirm, {
      type: 'warning',
      waitForResult: true,
      buttons: {
        'false': 'Cancel',
        'true': 'OK'
      }
    })

    manager.template('error', Confirm, {
      type: 'error',
      waitForResult: true,
      buttons: [
        'OK'
      ]
    })
  }
}

export default Plugin
