export default {
  name: 'Confirmable',

  props: {
    type: {
      type: String
    },
    text: {
      type: [String, Function],
      reqiured: true
    },
    title: {
      type: String
    },
    actions: {
      type: [Array, Object, Function]
    }
  }
}
