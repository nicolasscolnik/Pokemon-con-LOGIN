import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStoreArena = defineStore('arenaBatalla', {
  state: () => (
    {
      url: "",
      maestro1: ref({
        id: ref(0),
        nombre: ref(""),
        password: ref(""),
        tuTurno: ref(true),
        pGanadas: ref(0),
        pPerdidas: ref(0),
        esAdmin: ref(false),
        pokemons: ref([]),
        pokemonEnArena: ref({}),
        numeroJugador: ref(1)
      }),
      maestro2: ref({
        nombre: ref(""),
        tuTurno: ref(true),
        pokemons: ref([]),
        pokemonEnArena: ref({}),
        numeroJugador: ref(2)
      }),
    }),
  actions: {
    setter(objetoParam, numJugador) {
      let objeto = objetoParam.value
      if (numJugador === 1) {
        this.maestro1.nombre = objeto.nombre;
        this.maestro1.password = objeto.password;
        this.maestro1.pGanadas = objeto.pGanadas;
        this.maestro1.pPerdidas = objeto.pPerdidas;
        this.maestro1.esAdmin = objeto.esAdmin;
        this.maestro1.pokemons = objeto.pokemons;
        this.maestro1.pokemonEnArena = objeto.pokemons[0];
        this.maestro1.id = objeto.id;
      } else {
        this.maestro2.nombre = "Ash Ketchup";
        this.maestro2.pokemons = objeto.pokemons;
        this.maestro2.pokemonEnArena = objeto.pokemons[0];
      }
    },
  },

})
