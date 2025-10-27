import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles/main.scss'
import router from './router'
import store from './store'

createApp(App).use(store).use(router).mount('#app')

