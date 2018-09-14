<template>
  <span>
    <button v-for="action in actionlist" :key="action.key"
      class="button"
      :action-key="''+action.key"
      :class="{'loading': loadingAction === action.key}"
      :disabled="isActionDisabled(action) || !!loadingAction"
      @click="onActionClick(action)">
      {{ action.text }}
    </button>
  </span>
</template>
<script>

import Actionable from '../mixins/actionable'

export default {
  mixins: [ Actionable ]
}
</script>
