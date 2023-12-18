import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';

import App from './App.vue'
import ArenaDeBatalla from './components/ArenaDeBatalla.vue'
import BusquedaArena from './components/BusquedaArena.vue'
import CreacionMaestro from './components/CreacionMaestro.vue'
import Usuarios from './components/Usuarios.vue'


const routes = [
    {
        path: '/ArenaDeBatalla',
        component: ArenaDeBatalla,
    },
    {
        path: '/BusquedaArena',
        component: BusquedaArena,
    },
    {
        path: '/CreacionMaestro',
        component: CreacionMaestro,
    },
    {
        path: '/Usuarios',
        component: Usuarios,
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const app = createApp(App); // Cambia el componente inicial si es necesario
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.mount('#app');

