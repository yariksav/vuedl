export default {
  computed: {
    $parameters  () {
      return this.$options.propsData
    },
    isNewRecord: function () {
      return (!this.$options.primaryKey || !this.$options.propsData) || !this.$options.propsData[this.$options.primaryKey]
    }
  }
}
