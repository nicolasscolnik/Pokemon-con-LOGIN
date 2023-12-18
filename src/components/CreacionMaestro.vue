
<script setup>
import { ref } from 'vue'

import { useStoreMaestroPokemon } from '/stores/storeMaestroPokemon'
import { useStoreArena } from '/stores/storeArena'

const storeMaestro = useStoreMaestroPokemon();
const storeArena = useStoreArena();

const maestroPokemon = ref({
  id: 0,
  nombre: "",
  password: "",
  pGanadas: 0,
  pPerdidas: 0,
  esAdmin: false,
  tuTurno: true,
  pokemons: []
});
function crearPokemon(nombreAPI, vidaAPI, ataqueAPI, defensaAPI, fotoAPI) {
  let poke = {
    nombre: nombreAPI,
    vida: vidaAPI,
    ataque: ataqueAPI / 10,
    defensa: defensaAPI / 10,
    foto: fotoAPI
  }
  return poke;
}

const guardarMaestro = async () => {
  await login();
  await cargarPokemones();
  await storeMaestro.setter(maestroPokemon)
  await storeArena.setter(maestroPokemon, 1)
  await cargarPokemones();
  await storeArena.setter(maestroPokemon, 2)
};
const cargarPokemones = async () => {
  try {
    const apiUrl = "https://pokeapi.co/api/v2/pokemon/";
    const getRandomPokemonId = () => Math.floor(Math.random() * 151) + 1;
    const pokemons = [];
    for (let i = 0; i < 4; i++) {
      const randomPokemonId = getRandomPokemonId();
      const response = await fetch(`${apiUrl}${randomPokemonId}`);
      const data = await response.json();
      const nuevoPokemon = crearPokemon(
        data.name,
        data.stats[0].base_stat,
        data.stats[1].base_stat,
        data.stats[2].base_stat,
        data.sprites.front_default
      );
      pokemons.push(nuevoPokemon);
    }
    maestroPokemon.value.pokemons = pokemons;
  } catch (error) {
    console.error("Error al obtener Pokémon:", error);
  }

};

const login = async () => {
  debugger
  try {
    // Consultar la API para obtener la lista de usuarios
    const apiUrl = "https://651385e18e505cebc2e9ece5.mockapi.io/api/usuarios/dinamica";
    const response = await fetch(apiUrl);
    const usuarios = await response.json();
    if (usuarios.length === 0) {
      maestroPokemon.value.esAdmin = true;
      alert("No hay usuarios hasta el momento" + maestroPokemon.value.esAdmin)
    }
    // Buscar el usuario por nombre
    const usuarioEncontrado = usuarios.find(user => user.nombre === maestroPokemon.value.nombre);

    if (usuarioEncontrado) {
      // Si el usuario existe, verificar la contraseña
      if (usuarioEncontrado.password === maestroPokemon.value.password) {
        // Asignar valores al atributo referenciado maestroPokemon
        maestroPokemon.value.pGanadas = usuarioEncontrado.pGanadas;
        maestroPokemon.value.pPerdidas = usuarioEncontrado.pPerdidas;
        maestroPokemon.value.esAdmin = usuarioEncontrado.esAdmin;
        maestroPokemon.value.id = usuarioEncontrado.id;
      } else {
        // Si la contraseña no coincide, emitir un alert
        alert('Contraseña incorrecta');
      }
    } else {
      // Si el usuario no existe, crearlo a través del método checkUsuario
      await checkUsuario();
    }
  } catch (error) {
    console.error("Error al realizar el login:", error);
  }
};




const checkUsuario = async () => {

  const data = {
    nombre: maestroPokemon.value.nombre,
    password: maestroPokemon.value.password,
    esAdmin: maestroPokemon.value.esAdmin,
    pGanadas: 0,
    pPerdidas: 0
  }
  const apiUrl = "https://651385e18e505cebc2e9ece5.mockapi.io/api/usuarios/dinamica";
  const options = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'content-type': 'application/json' },
  };
  const user = await fetch(apiUrl, options)
    .then(data => {
      if (!data.ok) {
        throw Error(data.status);
      }
      // return data.json();
    }).then(update =>
      console.log(update))

  maestroPokemon.value.pGanadas = user.pGanadas;
  maestroPokemon.value.pPerdidas = user.pPerdidas;
  maestroPokemon.value.esAdmin = user.esAdmin;
  maestroPokemon.value.id = user.id;
}

const sonidoDesactivado = ref(false);
const toggleSonido = () => {
  sonidoDesactivado.value = !sonidoDesactivado.value;
};

</script>

<template>
  <audio class="audio" :autoplay="!sonidoDesactivado" loop :muted="sonidoDesactivado"
    src="/src/components/Media/Audio/Laboratory.mp3"></audio>

  <video autoplay loop muted class="video-background">
    <source src="/src/components/Media/Video/sr animated.mp4" type="video/mp4">
  </video>
  <img class="icono-sonido"
    :src="sonidoDesactivado ? '/src/components/Media/Imagenes/musicOff.png' : '/src/components/Media/Imagenes/musicOn.jpg'"
    alt="Icono Sonido" @click="toggleSonido" />

  <div class="gradient-background">

    <div class="logo-container">
      <img class="logo" src="/src/components/Media/Imagenes/International_Pokémon_logo.svg.png" alt="" srcset="">
    </div>
    <div class="container-formulario">
      <form class="formulario">
        <label for="nombre">Nombre:</label>
        <br>
        <input type="text" v-model="maestroPokemon.nombre" id="nombre" required>
        <br>
        <label for="password">Password:</label>
        <br>
        <input type="text" v-model="maestroPokemon.password" id="password" required>
        <br>
        <router-link to="/ArenaDeBatalla"><button class="btn btn-warning"
            @click="guardarMaestro">Guardar</button></router-link>
      </form>
      <br>
      <br>
    </div>

  </div>
</template>


<style scoped>
* {
  font-family: 'Press Start 2P', cursive;
}

.video-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

.logo-container {
  width: 100%;
  height: 100%;
  margin-bottom: 10px;
}

.logo {
  width: 800px;
  height: 300px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 25px;

}

.container-formulario {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  margin-top: 40px;
}

.formulario {
  display: inline-block;
  justify-content: center;
  align-items: center;
  width: 400px;
  height: 185px;
  border: 20px ridge #366dd1;
  border-radius: 10px;
  text-align: center;
  background: rgb(255, 255, 255);
}

.formulario label {
  margin-top: 10px;
}

.formulario input {
  width: 250px;
  margin: 15px;
}

.icono-sonido {
  width: 30px;
  height: 30px;
  cursor: pointer;
  position: fixed;
  top: 75px;
  left: 10px;
  z-index: 1000;
  border-radius: 5px;
}
</style>
