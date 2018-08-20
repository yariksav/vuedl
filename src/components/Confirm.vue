<template>
  <div class="confirm-box">
    <div v-if="!!title" class="confirm-title">
      <h1 class="title">{{ title }}</h1>
    </div>
    <div class="confirm-message" v-html="message" />
    <div class="confirm-buttons">
      <div class="column">
        <button v-for="button in parsedButtons" :key="button.key"
          class="button is-large is-is-default is-fullwidth"
          @click="onButtonClick(button)"
          v-html="button.text" />
      </div>
    </div>
  </div>
</template>
<script>

import ConfirmMixin from '../mixins/confirm'
export default {
  layout: 'default',
  mixins: [ConfirmMixin]
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
