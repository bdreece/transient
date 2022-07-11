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
import { Buffer } from 'buffer';
import { defineComponent, ref, Ref } from 'vue';
import { Song } from '../scripts/api.client';

import upload from '../scripts/upload.client';

export default defineComponent({
  setup() {
    // TODO: Define song defaults
    const song: Ref<Song> = ref({
      trackName: '',
      artistName: '',
      description: '',
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

    return {
      song,
    };
  },
  computed: {
    showUpload() {
      const {
        trackName,
        artistName,
        audio: { data, format },
      } = this.song;
      return trackName != '' && artistName != '' && data != '' && format != '';
    },
  },
  methods: {
    async handleFileChange({ target }: Event) {
      const files = (target as HTMLInputElement).files;

      if (files) {
        const data = await files[0].text();
        this.song.audio.format = files[0].type;
        this.song.audio.data = Buffer.from(data).toString('base64');
      }
    },
    async handleUpload() {
      await upload(this.song);
    },
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
            v-model="trackName"
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
            v-model="artistName"
            required
          />
        </div>
        <div class="form-control">
          <label class="label"> Track Description: </label>
          <textarea
            class="textarea textarea-bordered w-full max-w-xs"
            v-model="description"
          />
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
            @change="handleFileChange($event)"
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
            v-model="remainingPlays"
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
    </div>
  </div>
</template>
