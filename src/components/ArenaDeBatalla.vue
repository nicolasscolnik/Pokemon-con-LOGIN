<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useStoreMaestroPokemon } from '/stores/storeMaestroPokemon'
import MaestroPokemon from './MaestroPokemon.vue'
import { useStoreArena } from '/stores/storeArena'


let pokemones1 = ref([]);
let pokemones2 = ref([]);
let pokemonEnArena1 = ref(null)
let pokemonEnArena2 = ref(null)
let esMiTurno = ref(true);
let jugador1 = ref(null);
let jugador2 = ref(null);
let mostrarComponentes = ref(false);
let gameOver = ref(false);
let datosPeleaActuales = ref({});
const storeMaestro = useStoreMaestroPokemon();
const storeArena = useStoreArena();

const turnoIA = () => {
    if (!esMiTurno.value) {
        setTimeout(() => {
            const numRand = generarNumeroAleatorioIA();
            if (numRand === 1) {
                atacar(2);
            } else {
                curar(2);
            }
        }, 1000);
    }
};


const generarNumeroAleatorioIA = () => {
    const numeroDecimal = Math.random();
    const numeroRedondeado = Math.round(numeroDecimal);
    const resultado = numeroRedondeado + 1;

    return resultado;
}

const cambiaTurno = () => {
    esMiTurno.value = !esMiTurno.value;
}


const atacar = (id) => {
    if (id == 1) {
        pokemonEnArena2.value.vida -= pokemonEnArena1.value.ataque + 110;
    } else {
        pokemonEnArena1.value.vida -= pokemonEnArena2.value.ataque;
    }
    if (checkGanador()) {
        console.log("Hay ganador")
        gameOver.value = true;

    } else {
        cambiaTurno();
        turnoIA();
    }


}

const actualizaApi = async (resultado) => {
    try {
        const idMaestro = storeArena.maestro1.id;
        const apiUrl = `https://651385e18e505cebc2e9ece5.mockapi.io/api/usuarios/dinamica/${idMaestro}`;
        const data = {
            pGanadas: resultado === 1 ? storeArena.maestro1.pGanadas + 1 : storeArena.maestro1.pGanadas,
            pPerdidas: resultado === -1 ? storeArena.maestro1.pPerdidas + 1 : storeArena.maestro1.pPerdidas
        };

        const options = {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' },
        };

        const response = await fetch(apiUrl, options);

        if (!response.ok) {
            console.error('Error al actualizar la API:', response.status);
        }
    } catch (error) {
        console.error('Error al realizar la actualización:', error);
    }
};



const checkGanador = () => {
    let hayGanador = false;
    if (pokemonEnArena2.value.vida <= 0) {
        let pokeActual = pokemonEnArena2.value;
        alert(pokemonEnArena2.value.nombre + ' IS KAPUTTTT!!!!');
        if (pokemones2.value.length > 0) {
            enviarPokemonALaArena2(pokemones2.value[0], 2);
            pokemones2.value.pop(pokeActual);
        } else {
            alert('Acabo el juego SOQUETES!');
            actualizaApi(1);
            hayGanador = true;
        }

    } else if (pokemonEnArena1.value.vida <= 0) {
        let pokeActual = pokemonEnArena1.value;
        alert(pokemonEnArena1.value.nombre + ' IS KAPUTTTT!!!!');
        pokemonEnArena1 = ref();
        if (pokemones1.value.length > 0) {
            enviarPokemonALaArena2(pokemones1.value[0], 1);
            pokemones1.value.pop(pokeActual);
        } else {
            alert('Acabo el juego SOQUETES!');
            actualizaApi(-1);
            hayGanador = true;
        }
    }

    return hayGanador;
}


const curar = (id) => {
    if (id == 2) {
        pokemonEnArena2.value.vida += pokemonEnArena2.value.defensa;
    } else {
        pokemonEnArena1.value.vida += pokemonEnArena1.value.defensa;
    }
    cambiaTurno();
    turnoIA();
}

const montarStoreArena = () => {
    jugador1 = ref(storeArena.maestro1);
    jugador2 = ref(storeArena.maestro2);
}

const settingLocal2 = () => {
    montarStoreArena();

    pokemones1 = ref(jugador1.value.pokemons);
    pokemones2 = ref(jugador2.value.pokemons);
    pokemonEnArena1 = ref(jugador1.value.pokemonEnArena);
    pokemonEnArena2 = ref(jugador2.value.pokemonEnArena);
    enviarPokemonALaArena2(pokemones2.value[0], 2);
    enviarPokemonALaArena2(pokemones1.value[0], 1);
}

const enviarPokemonALaArena2 = (pokemon, maestro) => {
    const pokeAAsignar = pokemon;

    if (maestro == 2) {
        const indice = jugador2.value.pokemons.indexOf(pokeAAsignar);
        if (indice !== -1) {
            jugador2.value.pokemons.splice(indice, 1);
            if (jugador2.value.pokemons.length != 3) {
                jugador2.value.pokemons.push(pokemonEnArena2.value);
            }
            pokemonEnArena2.value = pokeAAsignar;
        }
    } else {

        const indice = jugador1.value.pokemons.indexOf(pokeAAsignar);
        if (indice !== -1) {
            jugador1.value.pokemons.splice(indice, 1);
            if (jugador1.value.pokemons.length != 3) {
                jugador1.value.pokemons.push(pokemonEnArena1.value);
            }
            pokemonEnArena1.value = pokeAAsignar;
        }
    }
};

const comienzaJuego = () => {

    mostrarComponentes.value = ref(!mostrarComponentes.value);
    settingLocal2();
}

const sonidoDesactivado = ref(false);
const toggleSonido = () => {
    sonidoDesactivado.value = !sonidoDesactivado.value;
};

</script>

<template>
    <audio class="audio" :autoplay="!sonidoDesactivado" loop :muted="sonidoDesactivado"
        src="/src/components/Media/Audio/Battle (Vs. Wild Pokémon).mp3"></audio>

    <video autoplay loop muted class="video-background">
        <source src="/src/components/Media/Video/Earth and Stars Animated Wallpaper [1080p Looping] [With DL] - Trim.mp4"
            type="video/mp4">
    </video>

    <img class="icono-sonido"
        :src="sonidoDesactivado ? '/src/components/Media/Imagenes/musicOff.png' : '/src/components/Media/Imagenes/musicOn.jpg'"
        alt="Icono Sonido" @click="toggleSonido" />

    <button type="button" class="btn btn-danger" @click="comienzaJuego" v-if="!mostrarComponentes">Comenzar!</button>
    <hr>
    <!-- <div v-if="mostrarComponentes && !gameOver">
        <router-link to="/Usuarios" v-if="jugador1.esAdmin"><button>Usuarios</button></router-link>
    </div> -->
    <hr>
    <div class="luchadores-container" v-if="mostrarComponentes && !gameOver">

        <MaestroPokemon v-if="jugador1" :nombre="jugador1.nombre" @horadeluchar="enviarPokemonALaArena2($event, 1)"
            @lastimar="atacar(1)" @curar="curar(1)" :pokemons="pokemones1" :tuTurno="esMiTurno"
            :pokemonEnArena="pokemonEnArena1" :numeroJugador="1" :botonera="true">
            Luchador 1</MaestroPokemon>
        <MaestroPokemon v-if="jugador2" :nombre="jugador2.nombre" @horadeluchar="enviarPokemonALaArena2($event, 2)"
            @lastimar="atacar(2)" @curar="curar(2)" :pokemons="pokemones2" :tuTurno="!esMiTurno"
            :pokemonEnArena="pokemonEnArena2" :numeroJugador="2">
            Luchador 2</MaestroPokemon>
    </div>

    <router-link to="/CreacionMaestro"><button class="btn btn-warning" v-if="gameOver">PLAY AGAIN MODAFAKA!!!</button></router-link>
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

.luchadores-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
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

.empezar-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 100px;
}
</style>
