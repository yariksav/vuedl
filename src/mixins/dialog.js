export default {
  computed: {
    gueryParams () {
      return this.$options.propsData
    },
    primaryKey () {
      return 'id'
    },
    wasOpenedInDialog () {
      return true
    },
    isNewRecord: function () {
      return (!this.primaryKey || !this.gueryParams) || !this.gueryParams[this.primaryKey]
    }
  }
}
