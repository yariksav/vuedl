<template>
  <transition name="vuedl-notification-fade">
    <div
      :class="['vuedl-notification', horizontalClass]"
      v-show="isActive"
      :style="getStyle"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
      role="alert"
    >
      <slot/>
      <div
        class="vuedl-notification__closeBtn"
        v-if="showClose"
        @click.stop="close">×</div>
    </div>
  </transition>
</template>

<script>

import Notifiable from '../mixins/notifiable'

export default {
  mixins: [ Notifiable ],
  props: {
  //   showClose: {
  //     type: Boolean,
  //     default: () => true
  //   },
    width: {
      type: Number,
      default: () => 330
    }
  },
  computed: {
    getStyle () {
      return {
        [this.verticalProperty]: `${this.verticalOffset}px`,
        'max-width': `${this.width}px`,
        'z-index': this.zIndex
      }
    }
  }
  // methods: {
  //   _destroy () {
  //     this.$el.addEventListener('transitionend', this.onTransitionEnd)
  //   },
  //   onTransitionEnd () {
  //     this.$el.removeEventListener('transitionend', this.onTransitionEnd)
  //     this.$destroy()
  //   }
  // }
}
</script>
<style>
  .vuedl-notification {
    display:-webkit-box;
    display:-ms-flexbox;
    display:flex;
    -webkit-box-sizing:border-box;
    box-sizing:border-box;
    position:fixed;
    -webkit-box-shadow:0 2px 12px 0 rgba(0,0,0,.1);
    box-shadow:0 2px 12px 0 rgba(0,0,0,.1);
    -webkit-transition:opacity .3s,left .3s,right .3s,top .4s,bottom .3s,-webkit-transform .3s;
    transition:opacity .3s,left .3s,right .3s,top .4s,bottom .3s,-webkit-transform .3s;
    transition:opacity .3s,transform .3s,left .3s,right .3s,top .4s,bottom .3s;
    transition:opacity .3s,transform .3s,left .3s,right .3s,top .4s,bottom .3s,-webkit-transform .3s;
    overflow:hidden
  }
  .vuedl-notification>div:first-child {
    width: 100%
  }
  .vuedl-notification.right {
    right:16px
  }
  .vuedl-notification.left {
    left:16px
  }
  .vuedl-notification__closeBtn {
    position:absolute;
    top: 9px;
    right: 15px;
    cursor: pointer;
    color: #909399;
    font-size: 22px;
  }
  .vuedl-notification__closeBtn:hover {
    color:#606266
  }
  .vuedl-notification-fade-enter.right{
    right:0;
    -webkit-transform:translateX(100%);
    transform:translateX(100%)
  }
  .vuedl-notification-fade-enter.left{
    left:0;
    -webkit-transform:translateX(-100%);
    transform:translateX(-100%)
  }
  .vuedl-notification-fade-leave-active {
    opacity:0
  }
  @media screen and (max-width: 450px) {
    .vuedl-notification {
      left:8px!important;
      right:8px!important;
      max-width: inherit!important;
    }
  }

 /* .el-notification-fade-enter {
    &.right {
      right: 0;
      transform: translateX(100%);
    }

    &.left {
      left: 0;
      transform: translateX(-100%);
    }
  }

  .el-notification-fade-leave-active {
    opacity: 0;
  }*/
</style>
