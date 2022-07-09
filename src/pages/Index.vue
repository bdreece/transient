<template>
  <div class="flex flex-col">
    <div class="hero py-12 bg-base-200">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold heading">Audio sharing, unlisted</h1>
          <p class="py-6">
            Have you ever wanted to share your tracks or stems with other
            artists, but reeled at the idea of releasing them to the general
            public? Look no further! With <strong>Transient</strong>, you can
            create temporary, unlisted links to your audio files for others to
            consume.
          </p>
          <a class="btn btn-primary" href="#get-started">Get Started</a>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 steps steps-vertical mx-56">
      <div id="get-started" class="step">Upload</div>
      <p class="my-8">
        Visit the
        <router-link class="link link-primary" to="/upload">Upload</router-link>
        page to upload your track or stem. Only one audio file per upload is
        supported at the time of writing this. Supported filetypes are MP3, WAV,
        AIFF, AAC, and OGG.
      </p>
      <div class="step">Configure</div>
      <p class="my-8">
        Configure your upload with the desired expiration time and/or maximum
        number of plays to control when your track is removed.
      </p>
      <div class="step">Share</div>
      <p class="my-8">
        Upon successful upload, we will provide you with a link to your track
        that is only valid per the settings provided in the Configuration step.
        Share this link with friends or other artists so they can download your
        track in its original quality.
      </p>
    </div>
  </div>
</template>
