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

import { defineComponent, ref } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';
export default defineComponent({
  setup() {
    const uploadTarget = ref(null);
    const configureTarget = ref(null);
    const shareTarget = ref(null);
    const uploadTargetIsVisible = ref(false);
    const configureTargetIsVisible = ref(false);
    const shareTargetIsVisible = ref(false);

    useIntersectionObserver(
      uploadTarget,
      ([{ isIntersecting }], _observerElement) => {
        uploadTargetIsVisible.value = isIntersecting;
      }
    );

    useIntersectionObserver(
      configureTarget,
      ([{ isIntersecting }], _observerElement) => {
        configureTargetIsVisible.value = isIntersecting;
      }
    );

    useIntersectionObserver(
      shareTarget,
      ([{ isIntersecting }], _observerElement) => {
        shareTargetIsVisible.value = isIntersecting;
      }
    );

    return {
      uploadTarget,
      configureTarget,
      shareTarget,
      uploadTargetIsVisible,
      configureTargetIsVisible,
      shareTargetIsVisible,
    };
  },
});
</script>

<template>
  <div class="flex flex-col">
    <div class="hero py-8 bg-base-200">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold heading">Audio sharing, unlisted</h1>
          <p class="py-6">
            Have you ever wanted to share your tracks or stems with other
            artists, but reeled at the idea of releasing them to the general
            public?
          </p>
          <p class="py-6">
            Look no further! With <strong>Transient</strong>, you can create
            temporary, unlisted links to your audio files for others to consume.
          </p>
          <div class="flex justify-center">
            <router-link class="btn btn-primary mx-4" to="upload">
              Upload Now
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div id="get-started" class="flex flex-col justify-center align-evenly">
      <ul class="steps sticky top-16 z-50 py-8 bg-base-100">
        <li :class="uploadTargetIsVisible ? 'step step-primary' : 'step'">
          Upload
        </li>
        <li :class="configureTargetIsVisible ? 'step step-accent' : 'step'">
          Configure
        </li>
        <li :class="shareTargetIsVisible ? 'step step-success' : 'step'">
          Share
        </li>
      </ul>
      <h2 ref="uploadTarget" class="flex justify-center text-2xl heading">
        Upload
      </h2>
      <p class="flex justify-center m-12">
        Visit the Upload page to upload your track or stem. Only one audio file
        per upload is supported at the time of writing this. Supported filetypes
        are MP3, WAV, AIFF, AAC, and OGG.
      </p>
      <h2 ref="configureTarget" class="flex justify-center text-2xl heading">
        Configure
      </h2>
      <p class="flex justify-center m-12">
        Configure your upload with a track name, artist name, album art, and
        maximum plays. Upon exhausting the maximum number of plays, the track
        will be automatically deleted from our database.
      </p>
      <h2 ref="shareTarget" class="flex justify-center text-2xl heading">
        Share
      </h2>
      <p class="flex justify-center m-12">
        Upon successful upload, we will provide you with a link to your track
        that is only valid per the settings provided in the Configuration step.
        Share this link with friends or other artists so they can download your
        track in its original quality.
      </p>
    </div>
  </div>
</template>
