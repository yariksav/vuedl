export default {
  name: 'Activable',

  data () {
    return {
      isActive: false
    }
  },

  // watch: {
  //   isActive (val) {
  //     console.log('activable.isActive', this.w)
  //     // if (!val) {
  //     //   if (this.$parent && this.$parent.isActive !== 'undefigned') {
  //     //     this.$parent.isActive = val
  //     //   }
  //     // }
  //   }
  // },

  mounted () {
    this.isActive = true
  }
}
