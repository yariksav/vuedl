export default {
  name: 'Activable',

  data () {
    return {
      isActive: false
    }
  },

  watch: {
    isActive (val) {
      if (this.isLayout) {
        this.$children.forEach(vm => {
          if (vm.isActive !== undefined) {
            vm.isActive = val
          }
        })
      } else {
        if (this.$parent && this.$parent.isActive !== undefined) {
          this.$parent.isActive = val
        }
      }
    }
  },

  methods: {
    close () {
      this.isActive = false
    }
  }
}
