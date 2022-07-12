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
import { defineComponent, inject, ref } from 'vue';

import Footer from './Footer.vue';

export default defineComponent({
  components: {
    Footer,
  },
  setup() {
    const toggleTheme: () => void = inject('toggleTheme') ?? (() => {});
    const searchId = ref('');

    const search = (event: KeyboardEvent) => {
      if (event.key == 'Enter') {
        window.location.href = `http://${window.location.host}/songs/${searchId.value}`;
      }
    };

    return { toggleTheme, searchId, search };
  },
});
</script>

<template>
  <div class="drawer">
    <input id="nav-toggle" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col">
      <div class="navbar bg-base-300 sticky top-0 z-50">
        <div class="flex-none">
          <label for="nav-toggle" class="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block w-5 h-5 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>
        </div>
        <div class="flex-1">
          <router-link class="btn btn-ghost normal-case text-xl heading" to="/">
            <i class="fa-solid fa-wave-square mr-2"></i>
            Transient
          </router-link>
        </div>
        <div class="flex-none dropdown dropdown-end">
          <label tabindex="0" class="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block w-5 h-5 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              ></path>
            </svg>
          </label>
          <ul
            tabindex="0"
            class="dropdown-content menu mt-4 p-2 shadow bg-base-300 rounded-box w-52"
          >
            <li>
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Dark Mode</span>
                  <input
                    type="checkbox"
                    class="toggle mx-2"
                    @click="toggleTheme"
                    checked
                  />
                </label>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <router-view />
      <Footer />
    </div>
    <div class="drawer-side">
      <label for="nav-toggle" class="drawer-overlay" />
      <ul class="menu p-4 overflow-y-auto w-80 bg-base-300">
        <li>
          <router-link class="btn btn-ghost" to="/">
            <i class="fa-solid fa-house"></i>
            Home
          </router-link>
        </li>
        <li>
          <router-link class="btn btn-ghost" to="/upload">
            <i class="fa-solid fa-upload"></i>
            Upload
          </router-link>
        </li>
        <li>
          <a class="btn btn-ghost" href="http://github.com/bdreece/transient">
            <i class="fa-brands fa-github"></i>
            GitHub
          </a>
        </li>
        <li class="flex-1 bg-base-300" />
        <li>
          <input
            class="input input-bordered"
            type="search"
            placeholder="Search"
            v-model="searchId"
            @keydown="search($event)"
          />
        </li>
      </ul>
    </div>
  </div>
</template>
