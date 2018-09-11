export default {
  name: 'Confirmable',

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
    },
    actions: {
      type: [Array, Object]
    }
  }
}
