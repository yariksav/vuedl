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
      showed: false
    }
  },
  watch: {
    showed (val) {
      if (!val) {
        setTimeout(() => {
          this.$destroy()
        }, this.waitBeforeDestroy || 300)
      }
    }
  },
  methods: {
    show () {
      this.showed = true
    },
    close () {
      this.showed = false
    }
  }
}
