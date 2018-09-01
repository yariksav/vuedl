export default {
  name: 'Activable',

  data () {
    return {
      isActive: false
    }
  },

  watch: {
    isActive (val) {
      console.log('isActive', val)
      if (!val) {
        if (this.$parent && this.$parent.isActive !== 'undefigned') {
          this.$parent.isActive = val
        }
      }
    }
  },

  mounted () {
    this.isActive = true
  }
}
