/*
 * vuedl
 *
 * (c) Savaryn Yaroslav <yariksav@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import DialogManager from './manager'
// import DialogLayout from './components/DialogLayout.vue'
// import NotificationLayout from './components/NotificationLayout.vue'
// import DialogOverlay from './components/DialogOverlay.vue'
// import Confirm from './components/Confirm.vue'

// import Actionable from './mixins/actionable'
// import Activable from './mixins/activable'
// import Confirmable from './mixins/confirmable'
// import Notifiable from './mixins/notifiable'
// import Recordable from './mixins/recordable'
// import Returnable from './mixins/returnable'

const Plugin = {
  install (Vue, options = {}) {
    const property = options.property || '$dialog'
    const manager = new DialogManager(options)

    Object.defineProperty(Vue.prototype, property, {
      get () {
        return manager
      }
    })
    // Vue.prototype[property] = manager

    // manager.layout('default', DialogLayout)
    //  manager.layout('notification', NotificationLayout)
    // manager.overlay('default', DialogOverlay)

    // manager.component('confirm', Confirm, {
    //   waitForResult: true,
    //   actions: {
    //     'false': 'Cancel',
    //     'true': 'OK'
    //   }
    // })

    // manager.component('warning', Confirm, {
    //   type: 'warning',
    //   waitForResult: true,
    //   actions: {
    //     'false': 'Cancel',
    //     'true': 'OK'
    //   }
    // })

    // manager.component('error', Confirm, {
    //   type: 'error',
    //   waitForResult: true,
    //   actions: [
    //     'OK'
    //   ]
    // })
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Plugin)
}
export default Plugin
