<script setup>
import { ref, onMounted } from 'vue';

const usuarios = ref([]);
const formON = ref(false);
const usuarioSeleccionado = ref({ id: '', nombre: '', pGanadas: '', pPerdidas: '' });

onMounted(() => {
    usuarios.value = [];
    let urlGet = "https://651385e18e505cebc2e9ece5.mockapi.io/api/usuarios/dinamica";

    fetch(urlGet)
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('No se pudo obtener la información');
            }
        })
        .then(data => {
            usuarios.value = data;
        })
        .catch(error => {
            console.error(error);
        });
});

const modificar = (usuario) => {
    usuarioSeleccionado.value = { ...usuario };
    formON.value = true;
};

const actualizarUsuario = async () => {
    try {
        const idUsuario = usuarioSeleccionado.value.id;
        const apiUrl = `https://651385e18e505cebc2e9ece5.mockapi.io/api/usuarios/dinamica/${idUsuario}`;
        const data = {
            nombre: usuarioSeleccionado.value.nombre,
            password: usuarioSeleccionado.value.password,
            pGanadas: usuarioSeleccionado.value.pGanadas,
            pPerdidas: usuarioSeleccionado.value.pPerdidas
        };

        const options = {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' },
        };

        const response = await fetch(apiUrl, options);

        if (response.ok) {
            console.log('Usuario actualizado correctamente.');
        } else {
            console.error('Error al actualizar el usuario:', response.status);
        }

        // Deshabilitar el formulario después de la actualización
        formON.value = false;
    } catch (error) {
        console.error('Error al realizar la actualización:', error);
    }
};
</script>

<template>
    <div>
        <h2>Usuarios</h2>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Peleas Ganadas</th>
                    <th scope="col">Peleas Perdidas</th>
                    <th scope="col">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(usuario) in usuarios" :key="usuario.id">
                    <th scope="row">{{ usuario.id }}</th>
                    <td>{{ usuario.nombre }}</td>
                    <td>{{ usuario.pGanadas }}</td>
                    <td>{{ usuario.pPerdidas }}</td>
                    <td>
                        <button class="btn btn-warning" @click="modificar(usuario)">Modificar</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="formON">
            <div class="form-group">
                <label for="nombre">Nombre</label>
                <input type="text" class="form-control" id="nombre" v-model="usuarioSeleccionado.nombre">
            </div>
            <div class="form-group">
                <label for="password">Contraseña</label>
                <input type="text" class="form-control" id="password" v-model="usuarioSeleccionado.password">
            </div>
            <button class="btn btn-primary" @click="actualizarUsuario">Actualizar</button>
        </div>
    </div>
</template>

<style scoped>
/* Estilos específicos para este componente si es necesario */
</style> 

