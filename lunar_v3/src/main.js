// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { mask } from 'vue-the-mask'
import './assets/main.css'
import clickOutside from './base/utils/v-click-outside'

const app = createApp(App)

app.use(router)
app.directive('mask', mask)
app.directive('click-outside', clickOutside);
app.mount('#app')
