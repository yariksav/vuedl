<template>
  <p>{{ name }}</p>
</template>

<script>
export default {
  asyncData () {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ name: 'Async data' }), 10)
    })
  }
}
</script>
