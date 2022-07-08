import {createApp} from 'vue'
import {createRouter, createWebHistory} from 'vue-router'
import App from './App.vue'
import Index from './pages/Index.vue'
import Search from './pages/Search.vue'
import Song from './pages/Song.vue'
import Upload from './pages/Upload.vue'
import "./main.css"

const routes = [
    {path: '/', component: Index},
    {path: '/search', component: Search},
    {path: '/upload', component: Upload},
    {path: '/:id', component: Song},
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

const app = createApp(App)

app.use(router)

app.mount('#app')
