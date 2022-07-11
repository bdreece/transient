<script setup lang="ts">
import cuid from 'cuid';
import { ref } from 'vue';

const API_HOST = 'localhost:8080';

const trackName = ref('');
const artistName = ref('');
const description = ref('');
const file = ref('');
const format = ref('');
const remainingPlays = ref(1);

const handleFileChange = async ({ target }: Event) => {
  const files = (target as HTMLInputElement).files;
  if (files) {
    const data = await files[0].arrayBuffer();
    format.value = files[0].type;
    file.value = Buffer.from(data).toString('base64');
  }
};

const handleUpload = async () => {
  const id = cuid.slug();
  const response = await fetch(`http://${API_HOST}/api/songs/${id}`, {
    method: 'OPTIONS',
    headers: {
      'Access-Control-Request-Method': 'POST',
      Origin: origin,
    },
    body: JSON.stringify({
      trackName: trackName.value,
      artistName: artistName.value,
      description: description.value,
      file: file.value,
      format: format.value,
      remainingPlays: remainingPlays.value,
    }),
  });
  if (response.ok) {
    // TODO: File uploaded successfully, display success modal
    const data = await response.text();
    const { id } = JSON.parse(data);
    console.log(`File uploaded successfully: ${id}`);
  } else {
    // TODO: File failed to upload, display failure modal
    console.log('File failed to upload');
  }
};
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
