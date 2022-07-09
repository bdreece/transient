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
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
export default {
  components: {
    navbar: Navbar,
    foot: Footer,
  },
  data() {
    return {
      theme: 'synthwave',
    };
  },
  methods: {
    toggleTheme() {
      this.theme = this.theme === 'synthwave' ? 'cyberpunk' : 'synthwave';
    },
  },
  provide() {
    return {
      toggleTheme: this.toggleTheme,
    };
  },
};
</script>

<template>
  <div :data-theme="theme">
    <navbar class="flex-0" />
    <router-view class="flex-1" />
    <foot class="flex-0" />
  </div>
</template>
