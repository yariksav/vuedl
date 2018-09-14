import Returnable from './returnable'

export default {
  name: 'Actionable',

  mixins: [ Returnable ],

  data () {
    return {
      loadingAction: null
    }
  },

  props: {
    actions: {
      type: [Array, Object],
      default: () => []
    }
  },

  computed: {
    actionlist () {
      const actions = []
      for (let key in this.actions) {
        let action = this.actions[key]
        if (typeof action === 'string') {
          action = {text: action}
        }
        this.$set(action, 'loading', false)
        if (!action.key) {
          action.key = isNaN(key) ? key : action.text
        }
        if (['true', 'false'].indexOf(action.key) >= 0) {
          action.key = JSON.parse(action.key)
        }
        actions.push(action)
      }
      return actions
    }
  },

  methods: {
    setLoadingToInstance (vm, value) {
      if (vm && vm.loading !== undefined) {
        vm.loading = value
      }
    },
    setLoadingState (value) {
      this.$emit('loading', value)
      !value && (this.loadingAction = null)
      this.setLoadingToInstance(this.$root, value)
      this.setLoadingToInstance(this.$root._dialogInstance, value)
    },
    isActionDisabled (action) {
      if (!action.disabled) {
        return false
      }
      if (typeof action.disabled === 'function') {
        return action.disabled()
      }
      return action.disabled
    },
    async onActionClick (action) {
      if (action.handle) {
        this.loadingAction = action.key
        this.setLoadingState(true)
        try {
          let ret = await action.handle()
          this.setLoadingState(false)
          if (ret !== false) {
            this.return(ret || action.key)
          }
        } catch (e) {
          this.setLoadingState(false)
          console.log('error', e) // TODO
          throw e
        }
      } else {
        this.return(action.key)
      }
    }
  }
}
