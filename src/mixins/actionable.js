import Returnable from './returnable'

export default {
  name: 'Actionable',

  mixins: [Returnable],

  data () {
    return {
      loadingAction: null
    }
  },

  props: {
    actions: {
      type: [Array, Object, Function],
      default: () => []
    },
    handle: Function, // todo: remove this parameter in next version
    handler: Function,
    params: Object
  },

  computed: {
    actionlist () {
      const actions = []
      const acts = typeof this.actions === 'function' ? this.actions(this) : (this.actions || [])
      for (const key in acts) { // eslint-disable-line
        let action = acts[key]
        if (['string', 'boolean'].includes(typeof action)) {
          action = { text: action }
        }
        if (!action.key) {
          action.key = isNaN(key) ? key : (action.text || key)
        }
        if (['true', 'false'].indexOf(action.key) >= 0) {
          action.key = JSON.parse(action.key)
        }
        if (!this.isActionVisible(action)) {
          continue
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

  created () {
    if (this.handle) {
      console.warn('DEPRECATED: "handle" prop will be deprecated, please use "handler" instead')
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
      const handler = action.handle || action.handler || this.handle || this.handler
      if (typeof handler === 'function') {
        this.loadingAction = action.key
        this.setLoadingState(true)
        try {
          const ret = await handler(this.params, action)
          this.setLoadingState(false)
          if (ret !== false && closable) {
            this.return(ret || action.key)
          }
        } catch (e) {
          this.setLoadingState(false)
          console.error('error', e) // TODO
          throw e
        }
      } else {
        closable && this.return(action.key)
      }
    }
  }
}
