/* @vue/component */
export default {
  name: 'Returnable',

  props: {
    returnValue: null
  },

  data: () => ({
    originalValue: null,
    returnResovers: []
  }),

  watch: {
    isActive (val) {
      console.log('isActive', val)
      if (val) {
        this.originalValue = this.returnValue
      } else {
        console.log('emit', this.originalValue)
        this.$emit('return', this.originalValue)
        this.$emit('update:returnValue', this.originalValue)
      }
    }
  },

  methods: {
    return (value) {
      console.log('return', value, this.isActive)
      this.originalValue = value
      this.isActive = false
    }
  }
}
