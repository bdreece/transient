<script lang="ts">
import { defineComponent, Ref, ref } from 'vue';

import type { Song } from '../scripts/api.client';
import download from '../scripts/download.client';

export default defineComponent({
  setup() {
    const song: Ref<Song> = ref({
      trackName: '',
      artistName: '',
      file: '',
      format: '',
      remainingPlays: 0,
    });

    return {
      song,
    };
  },
  async mounted() {
    const { id } = this.$route.params;
    const response = await download(id as string);
    if (response) {
      this.song = response;
    }
  },
  computed: {
    hasSong() {
      const { trackName, artistName, file, format } = this.song;
      return trackName != '' && artistName != '' && file != '' && format != '';
    },
  },
});
</script>

<template>
  <div class="flex justify-center">
    <div
      v-if="hasSong"
      class="flex-initial card w-96 my-8 bg-base-300 shadow-xl"
    ></div>
    <div v-else class="spinner">
      <div class="rect1" />
      <div class="rect2" />
      <div class="rect3" />
      <div class="rect4" />
      <div class="rect5" />
    </div>
  </div>
</template>
