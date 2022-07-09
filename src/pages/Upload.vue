<template>
  <h1 class="text-3xl heading my-4 flex justify-center">Upload</h1>
  <div class="flex justify-center">
    <div class="flex-initial card w-96 my-4 bg-base-300 shadow-xl">
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
          <label class="label">
            <span class="label-text">
              <span class="text-accent">* </span>
              Audio File:
            </span>
          </label>
          <input
            type="file"
            accept="audio/*"
            placeholder="Upload audio file here"
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
            <span class="label-text">Expiration Date:</span>
          </label>
          <input
            type="date"
            class="input input-bordered w-full max-w-xs"
            :value="expirationDate"
          />
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
export default {
  data() {
    return {
      trackName: '',
      artistName: '',
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
      // TODO: implement when backend is finished
      const id = cuid.slug();
      const response = await fetch(`/api/songs/${id}`, {
        method: 'POST',
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
