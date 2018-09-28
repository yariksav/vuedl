const notifications = []

const gap = 10

const insertNotification = (vm) => {
  const position = vm.position
  let verticalOffset = gap
  notifications.filter(item => item.position === position).forEach(item => {
    verticalOffset += item.$el.offsetHeight + gap
  })
  notifications.push(vm)
  vm.verticalOffset = verticalOffset
}

const deleteNotification = (vm) => {
  const index = notifications.findIndex(instance => instance === vm)
  if (index < 0) {
    return
  }
  notifications.splice(index, 1)
  const len = notifications.length
  const position = vm.position
  if (!len) return

  let verticalOffset = gap
  notifications.filter(item => item.position === position).forEach(item => {
    item.verticalOffset = verticalOffset
    verticalOffset += item.$el.offsetHeight + gap
  })
}

export default {
  props: {
    verticalOffset: Number,
    showClose: {
      type: Boolean,
      default: () => true
    },
    position: {
      type: String,
      default: () => 'top-right'
    },
    timeout: {
      type: [ Number, Boolean ],
      default: () => 4500
    },
    width: {
      type: Number,
      default: () => 330
    },
    zIndex: {
      type: Number,
      default: () => 2000
    }
  },
  computed: {
    horizontalClass () {
      return this.position.indexOf('right') > -1 ? 'right' : 'left'
    },
    verticalProperty () {
      return /^top-/.test(this.position) ? 'top' : 'bottom'
    },
    getStyle () {
      return {
        [this.verticalProperty]: `${this.verticalOffset}px`,
        'max-width': `${this.width}px`,
        'z-index': this.zIndex
      }
    }
  },
  methods: {
    _destroy () {
      this.$el.addEventListener('transitionend', this.onTransitionEnd)
    },
    onTransitionEnd () {
      this.$el.removeEventListener('transitionend', this.onTransitionEnd)
      this.$destroy()
    },
    clearTimer () {
      clearTimeout(this.timer)
    },
    startTimer () {
      if (this.timeout > 0) {
        this.timer = setTimeout(this.close, this.timeout)
      }
    },
    keydown (e) {
      if (e.keyCode === 46 || e.keyCode === 8) {
        this.clearTimer() // detele key
      } else if (e.keyCode === 27) { // esc key
        this.close()
      } else {
        this.startTimer() // any key
      }
    },
    close () {
      this.isActive = false
    }
  },
  watch: {
    isActive (val) {
      if (val) {
        insertNotification(this)
      } else {
        deleteNotification(this)
      }
    }
  },
  mounted () {
    this.startTimer()
    document.addEventListener('keydown', this.keydown)
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.keydown)
  }
}
