/*
 * vuedl
 *
 * (c) Savaryn Yaroslav <yariksav@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import DialogManager from './manager'
// import Notificator from './notificator'
import DialogLayout from './components/DialogLayout.vue'
import NotificationLayout from './components/NotificationLayout.vue'
import DialogOverlay from './components/DialogOverlay.vue'
import Confirm from './components/Confirm.vue'

const Plugin = {
  install (Vue, options = {}) {
    const property = options.property || '$dialog'
    const manager = new DialogManager(options)
    // const no = new Notificator(manager)
    Object.defineProperty(Vue.prototype, property, {
      get () {
        return manager
      }
    })

    manager.layout('default', DialogLayout)
    manager.layout('notification', NotificationLayout)
    manager.overlay('default', DialogOverlay)

    manager.component('confirm', Confirm, {
      waitForResult: true,
      actions: {
        'false': 'Cancel',
        'true': 'OK'
      }
    })

    manager.component('warning', Confirm, {
      type: 'warning',
      waitForResult: true,
      actions: {
        'false': 'Cancel',
        'true': 'OK'
      }
    })

    manager.component('error', Confirm, {
      type: 'error',
      waitForResult: true,
      actions: [
        'OK'
      ]
    })
  }
}

export default Plugin
