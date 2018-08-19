export default {
  props: {
    // width: {
    //   type: Number,
    //   default: 500
    // }
  },
  computed: {
    $params () {
      return this.$options.propsData
    },
    primaryKey () {
      return 'id'
    },
    isNewRecord: function () {
      return (!this.primaryKey || !this.$params) || !this.$params[this.primaryKey]
    }
  }
  // methods: {
  //   close () {
  //     this.$destroy()
  //   }
  // }
}