<template>
  <p>{{ name }} {{ desc }}</p>
</template>

<script>
export default {
  asyncData() {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ name: 'Foo' }), 10)
    })
  },
  data () {
    return {
      desc: 'Bar'
    }
  }
}
</script>
