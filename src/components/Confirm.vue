<template>
  <div class="confirm-box">
    <div v-if="!!title" class="confirm-title">
      <h1 class="title">{{ title }}</h1>
    </div>
    <div class="confirm-message" v-html="message" />
    <div class="confirm-buttons">
      <div class="column">
        <DialogActions :actions="actions"/>
      </div>
    </div>
  </div>
</template>
<script>

import Confirmable from '../mixins/confirmable'
import DialogActions from './DialogActions.vue'

export default {
  components: {
    DialogActions
  },
  layout: 'default',
  mixins: [ Confirmable ]
}

</script>

<style>
  .confirm-box {
    background: #ffffff;
  }
  .confirm-box .confirm-title {
    padding: 20px
  }
  .confirm-box .confirm-message {
    padding: 0 20px;
  }
  .confirm-box .confirm-buttons {
    text-align:  right;
    padding: 10px 20px;
  }
  .confirm-box .confirm-buttons .button {
    font-size: 20px;
    padding-left: 20px;
  }
</style>
