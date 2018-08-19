<template>
  <transition name="opacity">
    <div aria-label="loading" :style="{zIndex: zIndex}" v-if="visible" :class="['vc', 'vc-loading-overlay', 'no-select']"/>
  </transition>
</template>
<script>
export default {
  name: 'VDialogOverlay',
  props: {
    zIndex: {
      type: Number,
      required: false,
      default: 1250
    },
    visible: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>
<style>
.vc-loading-overlay
{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(112, 112, 112, 0.4);
  cursor: wait;
}

.vc-loading-overlay.vc-light
{
  background: rgba(0, 0, 0, .5);
}

.opacity-enter,
.opacity-leave-to
{
  opacity: 0.5;
}

.opacity-enter-active
{
  transition: opacity .3s ease;
}
.opacity-leave-active
{
  transition: all 0.2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

@keyframes rotating
{
  from
  {
    transform: rotate(0deg);
  }

  to
  {
    transform: rotate(360deg);
  }
}
</style>
