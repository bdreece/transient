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
            :value="trackName"
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
            :value="artistName"
            required
          />
        </div>
        <div class="form-control">
          <label class="label"> Track Description: </label>
          <textarea
            class="textarea textarea-bordered w-full max-w-xs"
            :value="description"
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
            @change="handleFileChange($event.target)"
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
            required
          />
        </div>
      </div>
      <div class="card-actions justify-center mb-2">
        <button
          v-show="file.size > 0"
          class="btn btn-primary"
          @click="handleUpload"
        >
          Upload
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import cuid from 'cuid';
const API_HOST = 'localhost:8080';
export default {
  data() {
    return {
      trackName: '',
      artistName: '',
      description: '',
      file: {},
      expirationDate: 'YYYY-MM-DD',
      maxPlays: 1,
    };
  },
  methods: {
    handleFileChange(target: HTMLInputElement) {
      const files = target.files;
      if (files) {
        this.file = files[0];
      }
    },
    async handleUpload() {
      const id = cuid.slug();
      const response = await fetch(`http://${API_HOST}/api/songs/${id}`, {
        method: 'OPTIONS',
        headers: {
          'Access-Control-Request-Method': 'POST',
          Origin: origin,
        },
        body: JSON.stringify({
          trackName: this.trackName,
          artistName: this.artistName,
          audio: await (<File>this.file).arrayBuffer(),
          format: (<File>this.file).type,
          expiration: this.expirationDate,
          maxPlays: this.maxPlays,
        }),
      });
      if (response.ok) {
        // TODO: File uploaded successfully, display success modal
        console.log('File uploaded successfully');
      } else {
        // TODO: File failed to upload, display failure modal
        console.log('File failed to upload');
      }
    },
  },
};
</script>
