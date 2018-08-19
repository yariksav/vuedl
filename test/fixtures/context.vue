<template>
  <div id="simple-content">
    Foo {{ name }}
  </div>
</template>

<script>
export default {
  props: {
    name: String
  }
}
</script>
