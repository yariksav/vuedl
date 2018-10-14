<template>
  <transition name="vdialog-modal">
    <div class="vdialog-modal-mask" @click.self.prevent.stop="dismiss">
        <div class="vdialog-modal-container" :style="{ 'max-width': getWidth }">
          <slot/>
        </div>
    </div>
  </transition>
</template>

<script>

export default {
  props: {
    width: Number,
    persistent: Boolean
  }
}
</script>

<style>
  .vdialog-modal-mask {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    left: 0;
    position: fixed;
    top: 0;
    transition: 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
    width: 100%;
    z-index: 6;
    outline: none;
    background-color: rgba(0, 0, 0, .5);
  }

  .vdialog-modal-container {
    overflow-y: auto;
    max-height: 95%;
    background-color: #fff;
    box-shadow: 0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12);
    border-radius: 2px;
    margin: 12px;
    overflow-y: auto;
    pointer-events: auto;
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    width: 100%;
    z-index: inherit;
  }

  /*
  * The following styles are auto-applied to elements with
  * transition="modal" when their visibility is toggled
  * by Vue.js.
  *
  * You can easily play with the modal transition by editing
  * these styles.
  */

  .vdialog-modal-enter {
    opacity: 0;
  }

  .vdialog-modal-leave-active {
    opacity: 0;
  }

  .vdialog-modal-enter .modal-container,
  .vdialog-modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
</style>
