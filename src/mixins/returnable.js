/* @vue/component */
export default {
  name: 'Returnable',

  props: {
    returnValue: null
  },

  // inject: ['layout'],

  data () {
    return {
      originalValue: this.returnValue,
      returnResovers: []
    }
  },

  // watch: {
  //   'wrapper.isActive' (val) {
  //     console.log('watch.isActive', val)
  //     if (val) {
  //       this.originalValue = this.returnValue
  //     } else {
  //       // console.log('emit', this.originalValue)
  //       // this.$emit('return', this.originalValue)
  //       this.$emit('update:returnValue', this.originalValue)
  //     }
  //   }
  // },

  methods: {
    return (value) {
      this.originalValue = value
      // console.log('return.layout', this.layout)
      this.$emit('update:returnValue', this.originalValue)
      // this.layout.isActive = false
      // this.$set(this, 'isActive', false)
    }
  }
}
