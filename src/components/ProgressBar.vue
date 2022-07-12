<script lang="ts">
import { computed, defineComponent } from 'vue';
export default defineComponent({
  props: ['max', 'value'],
  setup(props) {
    const max = computed(() => props.max);
    const value = computed(() => props.value);
    return { max, value };
  },
});
</script>

<template>
  <progress class="progress progress-success" :max="max" :value="value" />
</template>
