export default {
  props: {
    buttons: [Array, Object]
  },
  computed: {
    parsedButtons () {
      const buttons = []
      for (let key in this.buttons) {
        let button = this.buttons[key]
        if (typeof button === 'string') {
          button = {text: button}
        }
        if (!button.key) {
          button.key = isNaN(key) ? key : button.text
        }
        if (['true', 'false'].indexOf(button.key) >= 0) {
          button.key = JSON.parse(button.key)
        }
        buttons.push(button)
      }
      return buttons
    }
  },
  methods: {
    onButtonClick (button) {
      this.$emit('close', button.key)
    }
  }
}
