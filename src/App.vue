<script setup>
import { useStoreArena } from '/stores/storeArena'

const storeArena = useStoreArena();
const usuario = storeArena.maestro1;
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">

    <div class="collapse navbar-collapse" id="navbarSupportedContent" v-if="usuario.esAdmin">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link class="nav-link" to="/ArenaDeBatalla">ArenaDeBatalla</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/BusquedaArena">BusquedaArena</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/CreacionMaestro">CreacionMaestro</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/Usuarios">Usuarios</router-link>
        </li>
      </ul>
    </div>
    <div v-if="usuario.id != 0">Hola {{ usuario.nombre }}!!!</div>
    <router-link to="/CreacionMaestro"><button class="btn btn-warning">LOGIN</button></router-link>
  </nav>

  <hr>


  <div class="container">
    <RouterView></RouterView>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
