export default {
  computed: {
    $parameters  () {
      return this.$options.propsData
    },
    primaryKey () {
      return 'id'
    },
    isNewRecord: function () {
      return (!this.primaryKey || !this.$parameters) || !this.$parameters[this.primaryKey]
    }
  }
}
