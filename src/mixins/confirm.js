import ButtonsMixin from './buttons'

export default {
  mixins: [ButtonsMixin],
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
