<template>
  <p>{{ name }}</p>
</template>

<script>
const fetchData = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ name: 'Await async data' }), 10)
  })
}
export default {
  async asyncData() {
    const data = await fetchData()
    return data
  }
}
</script>
