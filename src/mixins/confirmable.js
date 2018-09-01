import Actionable from './actionable'

export default {
  name: 'Confirmable',

  mixins: [ Actionable ],

  props: {
    type: {
      type: String
    },
    text: {
      type: String,
      reqiured: true
    },
    title: {
      type: String
    }
  }
}
