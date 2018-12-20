// Import vue components
import DialogManager from './manager'
// import * as components from './components/index'

// install function executed by Vue.use()
function install (Vue, options = {}) {
  const property = options.property || '$dialog'
  const manager = new DialogManager(options)

  Object.defineProperty(Vue.prototype, property, {
    get () {
      return manager
    }
  })
}
// Create module definition for Vue.use()
const plugin = {
  install
}

// To auto-install when vue is found
/* global window global */
let GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue
}
if (GlobalVue) {
  GlobalVue.use(plugin)
}

// To allow use as module (npm/webpack/etc.) export components
export * from './mixins/index'
export default plugin
