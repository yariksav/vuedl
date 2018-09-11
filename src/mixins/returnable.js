/* @vue/component */
export default {
  name: 'Returnable',

  props: {
    returnValue: null
  },

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
  //       // this.$emit('submit', this.originalValue)
  //       this.$emit('update:returnValue', this.originalValue)
  //     }
  //   }
  // },

  methods: {
    return (value) {
      this.originalValue = value
      this.$root.$emit('submit', this.originalValue)
      this.$emit('submit', this.originalValue)
    }
  }
}
