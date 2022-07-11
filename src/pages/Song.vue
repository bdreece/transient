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
        <h2 class="card-title">{{ song.trackName }}</h2>
        <ul class="list-none">
          <li class="flex justify-start items-center">
            <h3 class="flex-initial text-lg mr-2">Artist Name:</h3>
            <p class="flex-initial">{{ song.artistName }}</p>
          </li>
          <li v-show="song.description != ''" class="flex flex-col w-96">
            <h3 class="flex-initial text-lg">Description:</h3>
            <p class="flex-initial">{{ song.description }}</p>
          </li>
        </ul>
        <audio controls class="my-2">
          <source :src="audioUrl" :type="format" />
        </audio>
        <div class="card-actions justify-center">
          <a class="btn btn-primary" :href="audioUrl" :download="filename">
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
