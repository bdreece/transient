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

import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import App from './App.vue';
import Index from './pages/Index.vue';
import Song from './pages/Song.vue';
import Upload from './pages/Upload.vue';

import './main.css';

const routes = [
  { path: '/', component: Index },
  { path: '/upload', component: Upload },
  { path: '/songs/:id', component: Song },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);

app.config.unwrapInjectedRef = true;
app.use(router);

app.mount('#app');
