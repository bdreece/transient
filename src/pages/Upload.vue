<template>
  <h1 class="text-3xl heading my-4 flex justify-center">Upload</h1>
  <div class="flex justify-center">
    <div class="flex-initial card w-96 bg-base-300 shadow-xl">
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
            @change="handleFileChange($event, index)"
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
        <button v-show="numFiles > 0" class="btn btn-primary">Upload</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      trackName: '',
      artistName: '',
      numFiles: 0,
      files: null,
      expirationDate: 'YYYY-MM-DD',
      maxPlays: 1,
    };
  },
  methods: {
    handleFileChange(event, _index) {
      this.files = event?.target?.files;
      this.numFiles = event?.target?.files.length;
    },
    handleUpload() {
      // TODO: implement when backend is finished
    },
  },
};
</script>
