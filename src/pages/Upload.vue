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
import { defineComponent } from 'vue';

const API_HOST = 'localhost:8080';

export default defineComponent({
  data() {
    return {
      trackName: '',
      artistName: '',
      description: '',
      file: '',
      format: '',
      remainingPlays: 1,
    };
  },
  computed: {
    showUpload() {
      return (
        this.trackName != '' &&
        this.artistName != '' &&
        this.file != '' &&
        this.format != ''
      );
    },
  },
  methods: {
    async handleFileChange({ target }: Event) {
      const files = (target as HTMLInputElement).files;

      if (files) {
        const data = await files[0].text();
        this.format = files[0].type;
        this.file = Buffer.from(data).toString('base64');
      }
    },
    async handleUpload() {
      const {
        trackName,
        artistName,
        description,
        file,
        format,
        remainingPlays,
      } = this;

      const response = await fetch(`http://${API_HOST}/api/songs`, {
        method: 'POST',
        headers: {
          'Access-Control-Request-Method': 'POST',
          'Content-Type': 'application/json',
          Origin: origin,
        },
        body: JSON.stringify({
          trackName,
          artistName,
          description,
          file,
          format,
          remainingPlays,
        }),
      });

      if (response.ok) {
        // TODO: File uploaded successfully, display success modal
        const data = await response.text();
        console.log(`Raw response: ${data}`);
        const { id } = JSON.parse(data);
        console.log(`File uploaded successfully: ${id}`);
      } else {
        // TODO: File failed to upload, display failure modal
        console.log('File failed to upload');
      }
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
