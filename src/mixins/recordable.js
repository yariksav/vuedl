export default {
  computed: {
    $parameters  () {
      return this.$attrs || this.$options.propsData || this.$props || {}
    },
    isNewRecord: function () {
      // console.log(this.$attrs, this.$props)
      // const data = this.$attrs || this.$options.propsData || this.$props
      return !this.$parameters || !this.$parameters[this.$options.primaryKey]
    }
  }
}
