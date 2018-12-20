export default {
  name: 'Activable',

  data () {
    return {
      isActive: false
    }
  },

  watch: {
    isActive (val) {
      if (this._dialogInstance) {
        if (this._dialogInstance.isActive !== undefined) {
          this._dialogInstance.isActive = val
        }
      } else {
        if (this.$parent && this.$parent.isActive !== undefined) {
          this.$parent.isActive = val
        }
      }
    }
  },

  methods: {
    close () {
      this.isActive = false
    }
  }
}
