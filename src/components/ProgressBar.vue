<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  props: ['max', 'value'],
  setup(props) {
    const max = ref<number>(props.max);
    const value = ref<number>(props.value);

    return { max, value };
  },
});
</script>

<template>
  <progress class="progress progress-success" :max="max" :value="value" />
</template>
