import DialogManager from './manager'
import DialogLayout from './components/DialogLayout.vue'
import DialogOverlay from './components/DialogOverlay.vue'

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
  }
}

export default Plugin
