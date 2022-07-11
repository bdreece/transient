<script lang="ts">
import { computed, defineComponent, Ref, ref } from 'vue';
import { createObjectURL, dataURLToBlob } from 'blob-util';
import { extension } from 'mime-types';

import Spinner from '../components/Spinner.vue';

import type { Song } from '../scripts/api.client';
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

    const audioUrl = computed(() => {
      return createObjectURL(dataURLToBlob(song.value.audio.data));
    });

    const imageUrl = computed(() => {
      return song.value.image && song.value.image.data != ''
        ? createObjectURL(dataURLToBlob(song.value.image.data))
        : 'https://static.vecteezy.com/system/resources/previews/000/196/846/original/realistic-cd-mockup-design-template-vector.jpg';
    });

    const format = computed(() => {
      const { data } = song.value.audio;
      const begin = data.indexOf(':') + 1;
      const end = data.indexOf(';') - 1;
      return data.slice(begin, end);
    });

    const filename = computed(() => {
      const ext = extension(format.value);
      if (ext) {
        return `${song.value.trackName}.${extension(format.value)}`;
      } else {
        return song.value.trackName;
      }
    });

    return {
      song,
      status,
      audioUrl,
      imageUrl,
      format,
      filename,
    };
  },
  computed: {
    id() {
      return this.$route.params.id as string;
    },
  },
  methods: {
    reloadPage() {
      window.location.reload();
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
      class="flex-initial card lg:card-side my-8 bg-base-300 shadow-xl"
    >
      <figure class="m-4">
        <img :src="imageUrl" alt="Song Image" width="256" height="256" />
      </figure>
      <div class="card-body">
        <h2 class="card-title justify-center text-3xl my-2">
          {{ song.trackName }}
        </h2>
        <div class="grid grid-cols-2">
          <h3 class="text-lg mr-2">Artist Name:</h3>
          <p class="text-md">{{ song.artistName }}</p>
          <h3 class="text-lg">Description:</h3>
          <p class="text-sm w-72">{{ song.description }}</p>
        </div>
        <div v-if="song.remainingPlays > 1" class="alert alert-info shadow-lg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="stroke-current flex-shrink-0 w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span> {{ song.remainingPlays }} plays remaining </span>
          </div>
        </div>
        <div
          v-else-if="song.remainingPlays == 1"
          class="alert alert-warning shadow-lg"
        >
          <div>
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>1 play remaining</span>
          </div>
        </div>
        <div v-else class="alert alert-error shadow-lg">
          <div>
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
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>No plays remaining! Song destroyed!</span>
          </div>
        </div>
        <audio controls class="my-2">
          <source :src="audioUrl" :type="format" />
        </audio>
        <div class="card-actions justify-evenly">
          <a class="btn btn-primary" :href="audioUrl" :download="filename">
            Download
          </a>
          <button class="btn btn-secondary" @click="reloadPage">Refresh</button>
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
