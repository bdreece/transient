<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';

import Spinner from './Spinner.vue';
import ProgressBar from './ProgressBar.vue';
import { Song } from '../scripts/api.client';
import upload from '../scripts/upload.client';

export default defineComponent({
  components: {
    ProgressBar,
    Spinner,
  },
  setup() {
    const id = ref('');
    const status = ref('');
    const show = ref(false);
    const copied = ref(false);
    const progress = ref(0);
    const total = ref(0);

    const link = computed(() => {
      return `http://${window.location.host}/songs/${id.value}`;
    });

    const copyLink = () => {
      navigator.clipboard.writeText(link.value);
      copied.value = true;
    };

    return { id, link, status, show, copied, copyLink, progress, total };
  },
  props: {
    song: {
      type: Object as PropType<Song>,
      required: true,
    },
  },
  async mounted() {
    this.show = true;
    const response = await upload(this.song, event => {
      this.total = event.lengthComputable ? event.total : -1;
      this.progress = event.loaded;
    });
    if (response) {
      this.id = response.data.id;
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
    <div v-if="status === '' && total <= 0" class="modal-box">
      <Spinner />
    </div>
    <div v-else-if="status === '' && total > 0" class="modal-box">
      <h2 class="text-xl">Uploading your track</h2>
      <p>This may take a few minutes</p>
      <ProgressBar :max="total" :value="progress" />
    </div>
    <div v-else-if="status === 'success'" class="modal-box">
      <h3 class="font-bold text-lg">Success</h3>
      <p class="py-4">Your track has been successfully uploaded!</p>
      <div class="m-4 p-2 border rounded">
        {{ link }}
      </div>
      <div v-show="copied" class="alert alert-success justify-start shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current flex-shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Copied to clipboard!</span>
      </div>
      <div class="modal-action justify-evenly">
        <router-link class="btn btn-primary" :to="`/songs/${id}`">
          View your Track
        </router-link>
        <button class="btn btn-primary" @click="copyLink">Copy Link</button>
      </div>
    </div>
    <div v-else class="modal-box">
      <h3 class="font-bold text-lg">Failure</h3>
      <p class="py-4">Your track failed to upload!</p>
    </div>
  </div>
</template>
