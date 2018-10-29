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
    },
    handle: Function,
    params: Object
  },

  computed: {
    actionlist () {
      const actions = []
      for (let key in this.actions) {
        let action = this.actions[key]
        if (typeof action === 'string') {
          action = { text: action }
        }
        if (!action.key) {
          action.key = isNaN(key) ? key : (action.text || key)
        }
        if (['true', 'false'].indexOf(action.key) >= 0) {
          action.key = JSON.parse(action.key)
        }
        if (typeof action.icon === 'string') {
          action.icon = {
            text: action.icon
          }
        }
        actions.push(action)
      }
      return actions
    }
  },

  methods: {
    trigger (name) {
      const action = this.actionlist.find(action => action.key === name)
      if (action && !this.isActionDisabled(action) && this.isActionVisible(action)) {
        this.onActionClick(action)
      }
    },
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
    get (param, def) {
      if (param === undefined) {
        return def
      }
      if (typeof param === 'function') {
        return param(this.params)
      }
      return param
    },
    isActionDisabled (action) {
      return this.get(action.disabled, false)
    },
    isActionVisible (action) {
      return this.get(action.visible, true)
    },
    isActionInLoading (action) {
      return this.loadingAction === action.key || this.get(action.loading)
    },
    async onActionClick (action) {
      const closable = action.closable === undefined || action.closable === true
      const handle = action.handle || this.handle
      if (typeof handle === 'function') {
        this.loadingAction = action.key
        this.setLoadingState(true)
        try {
          let ret = await handle(this.params)
          this.setLoadingState(false)
          if (ret !== false && closable) {
            this.return(ret || action.key)
          }
        } catch (e) {
          this.setLoadingState(false)
          console.log('error', e) // TODO
          throw e
        }
      } else {
        closable && this.return(action.key)
      }
    }
  }
}
