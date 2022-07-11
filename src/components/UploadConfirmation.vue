<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';

import Spinner from './Spinner.vue';

import { Song } from '../scripts/api.client';
import upload from '../scripts/upload.client';

export default defineComponent({
  components: {
    Spinner,
  },
  setup() {
    const id = ref('');
    const status = ref('');
    const show = ref(false);
    return { id, status, show };
  },
  props: {
    song: {
      type: Object as PropType<Song>,
      required: true,
    },
  },
  async mounted() {
    this.show = true;
    const id = await upload(this.song);
    if (id) {
      this.id = id;
      this.status = 'success';
    } else {
      this.status = 'failure';
    }
  },
});
</script>

<template>
  <input type="checkbox" id="my-modal" class="modal-toggle" :checked="show" />
  <div class="modal">
    <div v-if="status === ''" class="modal-box">
      <Spinner />
    </div>
    <div v-else-if="status === 'success'" class="modal-box">
      <h3 class="font-bold text-lg">Success</h3>
      <p class="py-4">Your track has been successfully uploaded!</p>
      <div class="m-4 p-2 border rounded">
        {{ `https://transient.bdreece.dev/songs/${id}` }}
      </div>
      <div class="modal-action">
        <router-link class="btn btn-primary" :to="`/songs/${id}`">
          View your Track
        </router-link>
      </div>
    </div>
    <div v-else class="modal-box">
      <h3 class="font-bold text-lg">Failure</h3>
      <p class="py-4">Your track failed to upload!</p>
    </div>
  </div>
</template>
