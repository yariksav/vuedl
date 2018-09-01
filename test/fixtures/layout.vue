<template>
  <div>
    <span id="title">Layout {{ prop1 }} {{ prop2 }}</span>
    <slot/>
  </div>
</template>

<script>
export default {
  props: {
    prop1: String,
    prop2: String
  }
}
</script>
