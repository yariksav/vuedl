import Activable from './activable'

export default {
  name: 'Layoutable',

  mixins: [ Activable ],

  props: {
    width: {
      type: Number,
      default: () => 450
    },
    persistent: Boolean
  },

  data () {
    return {
      loading: false
    }
  },

  compouted: {
    isLayout () {
      return true
    }
  },

  watch: {
    isActive (val) {
      if (!val) {
        // window.removeEventListener('popstate', this.close)
        this._destroy()
      }
    }
  },

  mounted () {
    // this.$nextTick(() => {
    // window.addEventListener('popstate', this.close)
    // })
    this.isActive = true
  },

  methods: {
    _destroy () {
      this.$destroy()
    },
    dismiss () {
      if (!this.persistent && !this.loading) {
        this.isActive = false
      }
    },
    close () {
      this.isActive = false
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
