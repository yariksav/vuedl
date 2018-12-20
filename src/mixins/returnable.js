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

  methods: {
    return (value) {
      this.originalValue = value
      this.$root.$emit('submit', this.originalValue)
      this.$emit('submit', this.originalValue)
    }
  }
}
