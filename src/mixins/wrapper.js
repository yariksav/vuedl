import Activable from './activable'

import Debug from 'debug'
const debug = Debug('vuedl:wrapper')

export default {
  name: 'Wrapper',

  mixins: [ Activable ],

  props: {
    width: {
      type: Number,
      default: 500
    },
    persistent: Boolean
  },

  data () {
    return {
      isActive: false
    }
  },

  watch: {
    isActive (val) {
      debug('isActive', val)
      if (!val) {
        window.removeEventListener('hashchange', this.remove)
        this.remove()
      }
    }
  },

  mounted () {
    this.$nextTick(() => {
      window.addEventListener('hashchange', this.remove)
    })
    this.isActive = true
  },

  methods: {
    remove () {
      this.$destroy(true)
    },
    close () {
      this.isActive = false
    },
    dismiss () {
      if (!this.persistent) {
        this.isActive = false
      }
    }
  },
  beforeDestroy () {
    if (typeof (this.$el).remove !== 'undefined') {
      this.$el.remove()
    } else {
      this.$el.parentNode.removeChild(this.$el)
    }
  }
}
