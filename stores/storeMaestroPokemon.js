import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStoreMaestroPokemon = defineStore('maestroPokemon', {
  state: () => (
    {
      nombre: ref(""),
      password: ref(""),
      tuTurno: ref(true),
      pGanadas: ref(0),
      pPerdidas: ref(0),
      esAdmin: ref(false),
      pokemons: ref({}),
      pokemonEnArena: ref({}),
      numeroJugador: ref(2)
    }),
  actions: {
    setter(objetoParam) {
      let objeto = objetoParam.value
      this.nombre = objeto.nombre;
      this.pGanadas = objeto.pGanadas;
      this.pPerdidas = objeto.pPerdidas;
      this.esAdmin = objeto.esAdmin;
      this.pokemons.value = objeto.pokemons;
      this.pokemonEnArena = this.pokemons.value[0];
    },
    getNombreJugador() {
      return this.nombre.value;
    },
  },

})
