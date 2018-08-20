export default {
  props: {
    width: {
      type: Number,
      default: 500
    },
    waitBeforeDestroy: Number
  },
  data () {
    return {
      isActive: false
    }
  },
  watch: {
    isActive (val) {
      if (!val) {
        setTimeout(() => {
          this.$destroy()
        }, this.waitBeforeDestroy || 300)
      }
    }
  },
  mounted () {
    this.show()
  },
  methods: {
    show () {
      this.isActive = true
    },
    close () {
      this.isActive = false
    }
  }
}
