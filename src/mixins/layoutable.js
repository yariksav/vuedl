import Activable from './activable'

// import Debug from 'debug'
// const debug = Debug('vuedl:wrapper')

export default {
  name: 'Layoutable',

  mixins: [ Activable ],

  props: {
    width: {
      type: Number,
      default: 500
    },
    persistent: Boolean
  },

  provide () {
    return {
      layout: this.$data
    }
  },

  watch: {
    isActive (val) {
      // console.log('layout.isActive', val)
      if (!val) {
        window.removeEventListener('hashchange', this.remove)
        this._destroy()
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
    _destroy () {
      this.$destroy()
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
