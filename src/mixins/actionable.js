import Returnable from './returnable'

export default {
  name: 'Actionable',

  mixins: [ Returnable ],

  props: {
    actions: {
      type: [Array, Object],
      required: true
    }
  },

  computed: {
    actionsArray () {
      const actions = []
      for (let key in this.actions) {
        let action = this.actions[key]
        if (typeof action === 'string') {
          action = {text: action}
        }
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
    onActionClick (action) {
      console.log('onActionClick', action)
      this.return(action.key)
      // this.close()
      // this.$emit('close', action.key)
    }
  }
}
