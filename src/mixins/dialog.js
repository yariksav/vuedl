export default {
  computed: {
    $params () {
      return this.$options.propsData
    },
    primaryKey () {
      return 'id'
    },
    wasOpenedInDialog () {
      return true
    },
    isNewRecord: function () {
      return (!this.primaryKey || !this.$params) || !this.$params[this.primaryKey]
    }
  }
}
