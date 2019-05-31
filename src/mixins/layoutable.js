import Activable from './activable'

export default {
  name: 'Layoutable',
  mixins: [ Activable ],
  inheritAttrs: false,

  props: {
    width: {
      type: [ String, Number ],
      default: () => 450
    },
    persistent: Boolean
  },

  data () {
    return {
      loading: false
    }
  },

  computed: {
    isLayout () {
      return true
    },
    getWidth () {
      return typeof this.width === 'string' ? this.width : this.width + 'px'
    }
  },

  watch: {
    isActive (val) {
      if (!val) {
        this._destroy()
      }
    }
  },

  mounted () {
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
    if (typeof this.$el.remove === 'function') {
      this.$el.remove()
    } else if (this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  }
}
