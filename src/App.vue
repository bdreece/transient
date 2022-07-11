<script setup lang="ts">
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
import { ref, defineComponent, provide } from 'vue';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

const theme = ref('synthwave');
const toggleTheme = () => {
  theme.value = theme.value === 'synthwave' ? 'cyberpunk' : 'synthwave';
};

provide('toggleTheme', toggleTheme);

export default defineComponent({
  components: {
    Navbar,
    Footer,
  },
});
</script>

<template>
  <div :data-theme="theme">
    <Navbar />
    <Footer />
  </div>
</template>
