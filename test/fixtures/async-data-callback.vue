<template>
  <p>{{ name }}</p>
</template>

<script>
export default {
  asyncData (context, callback) {
    setTimeout(function () {
      callback(null, { name: 'Async data with callback' })
    }, 10)
  }
}
</script>
