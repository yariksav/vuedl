<template>
  <component
    :is="component"
    :class="{ button: true, loading: this.loading }"
    :disabled="disabled"
    v-bind="attrs"
    @click="$emit('click', this)"
  >
    {{ text }}
  </component>
</template>
<script>

export default {
  props: {
    attrs: Object,
    component: {
      type: [String, Object],
      default: () => 'button'
    },
    disabled: Boolean,
    loading: Boolean,
    text: String
  }
}
</script>
