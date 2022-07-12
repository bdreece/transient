<script lang="ts">
/* Transient - A temporary audio file sharing service
 * Copyright (C) 2022 Brian Reece
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { computed, defineComponent, ref, Ref } from 'vue';
import { blobToDataURL } from 'blob-util';

import UploadConfirmation from '../components/UploadConfirmation.vue';
import type { Song } from '../scripts/api.client';

export default defineComponent({
  components: {
    UploadConfirmation,
  },
  setup() {
    const song: Ref<Song> = ref({
      trackName: '',
      artistName: '',
      description: '',
      image: '',
      audio: '',
      remainingPlays: 0,
    });

    const show = ref(false);

    const showUpload = computed(() => {
      const { trackName, artistName, audio, remainingPlays } = song.value;
      return (
        trackName != '' && artistName != '' && audio != '' && remainingPlays > 0
      );
    });

    const handleAudioChange = async ({ target }: Event) => {
      const files = (target as HTMLInputElement).files;

      if (files) {
        song.value.audio = await blobToDataURL(files[0]);
      }
    };

    const handleImageChange = async ({ target }: Event) => {
      const files = (target as HTMLInputElement).files;

      if (files) {
        song.value.image = await blobToDataURL(files[0]);
      }
    };

    const handleUpload = () => {
      show.value = true;
    };

    return {
      song,
      show,
      showUpload,
      handleAudioChange,
      handleImageChange,
      handleUpload,
    };
  },
});
</script>

<template>
  <h1 class="text-3xl heading mt-4 flex justify-center">Upload</h1>
  <div class="flex justify-center">
    <div class="flex-initial card w-96 my-8 bg-base-300 shadow-xl">
      <div class="card-body">
        <div class="form-control">
          <label class="label">
            <span class="label-text">
              <span class="text-accent">* </span>
              Track Name:
            </span>
          </label>
          <input
            type="text"
            placeholder="Insert track name here"
            class="input input-bordered w-full max-w-xs"
            v-model="song.trackName"
            required
          />
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">
              <span class="text-accent">* </span>
              Artist Name:
            </span>
          </label>
          <input
            type="text"
            placeholder="Insert artist name here"
            class="input input-bordered w-full max-w-xs"
            v-model="song.artistName"
            required
          />
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text"> Track Description: </span>
          </label>
          <textarea
            class="textarea textarea-bordered w-full max-w-xs"
            v-model="song.description"
          />
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text"> Image File: </span>
          </label>
          <input
            type="file"
            accept="image/*"
            class="input input-bordered w-full max-w-xs"
            @change="handleImageChange($event)"
          />
          <label class="label">
            <span class="label-text-alt">(*.jpg, *.png, *.gif, *.tiff)</span>
          </label>
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">
              <span class="text-accent">* </span>
              Audio File:
            </span>
          </label>
          <input
            type="file"
            accept="audio/*"
            class="input input-bordered w-full max-w-xs"
            @change="handleAudioChange($event)"
            required
          />
          <label class="label">
            <span class="label-text-alt"
              >(*.mp3, *.wav, *.aiff, *.aac, *.ogg)</span
            >
          </label>
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">Maximum Plays</span>
          </label>
          <input
            type="number"
            step="1"
            min="1"
            class="input input-bordered w-full max-w-xs"
            v-model="song.remainingPlays"
            required
          />
        </div>
      </div>
      <div class="card-actions justify-center mb-2">
        <button
          v-show="showUpload"
          class="btn btn-primary"
          @click="handleUpload"
        >
          Upload
        </button>
      </div>
      <UploadConfirmation v-if="show" :song="song" />
    </div>
  </div>
</template>
