<script lang="ts">
import { defineComponent, Ref, ref } from 'vue';
import { dataURLToBlob } from 'blob-util';
import { extension } from 'mime-types';

import Spinner from '../components/Spinner.vue';

import type { File, Song } from '../scripts/api.client';
import download from '../scripts/download.client';

export default defineComponent({
  components: {
    Spinner,
  },
  setup() {
    const song: Ref<Song> = ref({
      trackName: '',
      artistName: '',
      image: {
        data: '',
        format: '',
      },
      audio: {
        data: '',
        format: '',
      },
      remainingPlays: 0,
    });

    const status = ref('');

    return {
      song,
      status,
    };
  },
  computed: {
    id() {
      return this.$route.params.id as string;
    },
  },
  methods: {
    toURL(data: string) {
      return URL.createObjectURL(dataURLToBlob(data));
    },
    toFilename(format: string) {
      const ext = extension(format);
      if (ext) {
        return `${this.song.trackName}.${extension(format)}`;
      } else {
        return this.song.trackName;
      }
    },
  },
  async mounted() {
    const { id } = this.$route.params;
    const response = await download(id as string);
    if (response != undefined) {
      this.status = 'success';
      this.song = response;
    } else {
      this.status = 'failure';
    }
  },
});
</script>

<template>
  <div class="flex justify-center">
    <Spinner v-if="status === ''" />
    <div
      v-else-if="status === 'success'"
      class="flex-initial card w-96 my-8 bg-base-300 shadow-xl"
    >
      <figure><img :src="toURL(song.image.data)" alt="" /></figure>
      <div class="card-body">
        <h2 class="card-title">{{ song.trackName }}</h2>
        <ul class="list-none">
          <li>Artist Name: {{ song.artistName }}</li>
          <li>Description: {{ song.description }}</li>
        </ul>
        <div class="card-actions justify-center">
          <a
            class="btn btn-primary"
            :href="toURL(song.audio.data)"
            :download="toFilename(song.audio.format)"
          >
            Download
          </a>
        </div>
      </div>
    </div>
    <div v-else class="flex-initial card w-96 my-8 bg-base-300 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Song does not exist!</h2>
        <p>
          The provided song ID could not be found, either because it was never
          created, or the song's remaining plays have been exhausted.
        </p>
      </div>
    </div>
  </div>
</template>
