import axios from "axios";
//LOCAL HOST
//const url = "https://localhost:7253/api";

//SOMEE
//const url = "http://www.amigospeludos.somee.com/api";

//AZURE
const url = "https://amigospeludos.azurewebsites.net/api";

//GET USUARIO
export async function getUser() {
    try {
        const response = await axios({
            url: `${url}/usuario`,
            method: "GET",
        });

        return response;
    } catch (error) {
        console.log(error);
    }
}
//GET ROL
export async function getRol() {
    try {
        const response = await axios({
            url: `${url}/rols`,
            method: "GET",
        });

        return response;
    } catch (error) {
        console.log(error);
    }
}
export async function getUserId(id) {
    try {
        const response = await axios({
            url: `${url}/usuario/${id}`,
            method: "GET",
        });

        return response;
    } catch (error) {
        console.log(error);
    }
}
export async function getUserMail(mail) {
    try {
        const response = await axios({
            url: `${url}/usuarioFull/email/${mail}`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getUsuarioCompleto() {
    try {
        const response = await axios({
            url: `${url}/usuario/mail`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

//GET BARRIO
export async function getBarrioUser(id) {
    try {
        const response = await axios({
            url: `${url}/barrio/${id}`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
export async function getAllBarrio() {
    try {
        const response = await axios({
            url: `${url}/barrio`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

//GET CIUDAD
export async function getCiudad() {
    try {
        const response = await axios({
            url: `${url}/ciudad/`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
//GET CIUDAD del usuario
export async function getCiudadUser(id) {
    try {
        const response = await axios({
            url: `${url}/ciudad/${id}`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

//GET GENERO
export async function getGenero() {
    try {
        const response = await axios({
            url: `${url}/genero`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
export async function getGeneroId(id) {
    try {
        const response = await axios({
            url: `${url}/genero/${id}`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
//GET DATOS DE MASCOTAS CON ID
export async function getMascotaId(id) {
    try {
        const response = await axios({
            url: `${url}/mascotaFull/${id}`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
//GET MASCOTAS DE USUARIO
export async function getMascotasUsuario(idUsuario) {
    try {
        const response = await axios({
            url: `${url}/mascotaFull/usuario/${idUsuario}`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

//GET TIPO MASCOTA
export async function getTipoMascota() {
    try {
        const response = await axios({
            url: `${url}/tipoMascota`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
//GET TIPO MASCOTA POR ID
export async function getTipoMascotaId(id) {
    try {
        const response = await axios({
            url: `${url}/tipoMascota/${id}`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

//GET SEXO MASCOTA
export async function getSexoMascota() {
    try {
        const response = await axios({
            url: `${url}/sexoMascota`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
//GET EDAD TODAS LAS MASCOTA
export async function getAllEdadMascota() {
    try {
        const response = await axios({
            url: `${url}/edadMascota/`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
//GET EDAD MASCOTA ID
export async function getEdadMascotaId(id) {
    try {
        const response = await axios({
            url: `${url}/edadMascota/${id}`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
//GET DATOS DE TODAS LAS RAZAS CON ID
export async function getAllRazaId(id) {
    try {
        const response = await axios({
            url: `${url}/raza/tipomascota/${id}`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

//GET DATOS DE RAZA CON ID
export async function getRazaId(id) {
    try {
        const response = await axios({
            url: `${url}/raza/${id}`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
//GET DATOS DE RAZA
export async function getRaza() {
    try {
        const response = await axios({
            url: `${url}/raza`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

//POST
export async function postUser(userData) {
    try {
        const response = await axios.post(`${url}/usuario`, userData);
        return response;
    } catch (error) {
        console.log(error);
    }
}
export async function postUserWithGoogle(userData) {
    try {
        const response = await axios.post(`${url}/usuario`, userData);
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function postMascota(userData) {
    try {
        const response = await axios.post(`${url}/mascota`, userData);
        return response;
    } catch (error) {
        console.log(error);
    }
}

//UPDATE USER
export async function updateUser(id, userData) {
    try {
        const existingUserData = await getUserId(id); // Obtener los datos existentes del usuario desde la API
        const updatedUserData = Object.assign(
            {},
            existingUserData.data,
            userData
        ); // Combinar los datos existentes y los datos actualizados

        const response = await axios.put(
            `${url}/usuario/${id}`,
            updatedUserData
        );
        return response;
    } catch (error) {
        console.log(error);
    }
}
//UPDATE PET
export async function updatePets(idPet, dataPet) {
    try {
        // Obtener los datos existentes de la mascota desde la API
        const existingPetData = await getMascotaId(idPet);

        // Combinar los datos existentes y los datos actualizados
        const updatedPetData = {
            ...existingPetData,
            ...dataPet,
        };

        // Realizar la solicitud PUT para actualizar la mascota
        const response = await axios.put(
            `${url}/mascota/${idPet}`,
            updatedPetData
        );

        return response;
    } catch (error) {
        console.log(error);
    }
}

//ELIMINAR MASCOTA

export const deletePet = async (petId) => {
    try {
        const response = await axios.delete(`${url}/mascota/${petId}`);
        return response;
    } catch (error) {
        console.error(error);
    }
};

//PUBLICACIONES
//GET  PUBLICACIONES
export async function getPublicaciones() {
    try {
        const response = await axios({
            url: `${url}/publicacionMascota`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
//GET PUBLICACIONES ID
export async function getPublicacionesId(id) {
    try {
        const response = await axios({
            url: `${url}/publicacionMascota/${id}`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
//GET PUBLICACIONES DE UN USUARIO
export async function getPublicacionesUser(mail) {
    try {
        const response = await axios({
            url: `${url}/publicacionMascota/email/${mail}`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

//GET TIPO DE PUBLICACIONES MASCOTAS PERDIDAS
export async function getMascotasPublicadas(tipoPublicacion) {
    try {
        const response = await axios({
            url: `${url}/publicacionMascota/tipo/${tipoPublicacion}`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

//POST PUBLICACIONES
export async function postPublicacion(userData) {
    try {
        const response = await axios.post(
            `${url}/publicacionMascota`,
            userData
        );
        return response;
    } catch (error) {
        console.log(error);
    }
}

//UPDATE PUBLICACIONES
export async function updatePost(id, userData) {
    try {
        console.log(userData);
        const existingUserData = await getPublicacionesId(id); // Obtener los datos existentes del usuario desde la API
        console.log(existingUserData);

        const updatedUserData = Object.assign({}, existingUserData, userData); // Combinar los datos existentes y los datos actualizados

        const response = await axios.put(
            `${url}/publicacionMascota/${id}`,
            updatedUserData
        );
        return response;
    } catch (error) {
        console.log(error);
    }
}

//ELIMINAR PUBLICACION

export const deletePost = async (petId) => {
    try {
        const response = await axios.delete(
            `${url}/publicacionMascota/${petId}`
        );
        return response;
    } catch (error) {
        console.error(error);
    }
};

//POST FORMULARIO
export async function postFormularioAdopcion(userData) {
    try {
        const response = await axios.post(
            `${url}/formularioAdopcions`,
            userData
        );
        return response;
    } catch (error) {
        console.log(error);
    }
}

//GET FORMULARIOS dueño del posteo
export async function getFormulariosDuenoPosteo(id) {
    try {
        const response = await axios({
            url: `${url}/formularioAdopcions/usuarioSolicitado/${id}`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

//GET FORMULARIOS persona que quiere adoptar
export async function getFormulariosPosibleAdoptante(id) {
    try {
        const response = await axios({
            url: `${url}/formularioAdopcions/usuarioSolicitante/${id}`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

//GET FORMULARIOS con ID
export async function getFormulariosId(id) {
    try {
        const response = await axios({
            url: `${url}/formularioAdopcions/${id}`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

//GET FORMULARIOS con ID
export async function getFormularios(id) {
    try {
        const response = await axios({
            url: `${url}/formularioAdopcions`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}


//GET estados FORMULARIOS
export async function getEstadosFormularios() {
    try {
        const response = await axios({
            url: `${url}/estadoFormularios`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

//UPDATE ESTADO FORMULARIO
export async function updateForm(id, userData) {
    try {
        console.log(userData);
        const existingUserData = await getFormulariosId(id); // Obtener los datos existentes del usuario desde la API
        console.log(existingUserData);

        const updatedUserData = Object.assign({}, existingUserData, userData); // Combinar los datos existentes y los datos actualizados

        const response = await axios.put(
            `${url}/formularioAdopcions/${id}`,
            updatedUserData
        );
        return response;
    } catch (error) {
        console.log(error);
    }
}

//GET EXPERIENCIA PASEADOR

export async function getExperiencia() {
    try {
        const response = await axios({
            url: `${url}/experiencia`,
            method: "GET",
        });

        return response.data; // Devuelve solo los datos (response.data)
    } catch (error) {
        console.error("Error al obtener experiencia:", error);
        throw error; // Lanza el error para que pueda ser manejado en el componente.
    }
}

//POST PASEADOR
export async function postPaseador(userData) {
    try {
        const response = await axios.post(`${url}/paseador`, userData);
        return response;
    } catch (error) {
        console.log(error);
    }
}

//GET  PASEADOR

export async function getPaseador() {
    try {
        const response = await axios({
            url: `${url}/paseador`,
            method: "GET",
        });
        return response.data; // Devuelve solo los datos (response.data)
    } catch (error) {
        console.error("Error al obtener paseadores:", error);
        throw error; // Lanza el error para que pueda ser manejado en el componente.
    }
}

//GET  PASEADOR POR ID

export async function getPaseadorPorId(id) {
    try {
        const response = await axios({
            url: `${url}/paseador/${id}`,
            method: "GET",
        });
        return response.data; // Devuelve solo los datos (response.data)
    } catch (error) {
        console.error("Error al obtener paseadores:", error);
        throw error; // Lanza el error para que pueda ser manejado en el componente.
    }
}

//GET  cuidadores

export async function getCuidadores() {
    try {
        const response = await axios({
            url: `${url}/cuidadors`,
            method: "GET",
        });
        return response.data; // Devuelve solo los datos (response.data)
    } catch (error) {
        console.error("Error al obtener cuidadores:", error);
        throw error; // Lanza el error para que pueda ser manejado en el componente.
    }
}

//GET  cuidadores id

export async function getCuidadoresId(id) {
    try {
        const response = await axios({
            url: `${url}/cuidadors/${id}`,
            method: "GET",
        });
        return response.data; // Devuelve solo los datos (response.data)
    } catch (error) {
        console.error("Error al obtener cuidadores:", error);
        throw error; // Lanza el error para que pueda ser manejado en el componente.
    }
}

// GET TIPO VIVIENDA

export async function getTipoVivienda() {
    try {
        const response = await axios({
            url: `${url}/tipoViviendas`,
            method: "GET",
        });
        return response.data; // Devuelve solo los datos (response.data)
    } catch (error) {
        console.error("Error al obtener tipo de vivienda:", error);
        throw error; // Lanza el error para que pueda ser manejado en el componente.
    }
}

//POST CUIDADOR
export async function postCuidador(userData) {
    try {
        const response = await axios.post(`${url}/cuidadors`, userData);
        return response;
    } catch (error) {
        console.log(error);
    }
}

//POST vewterinaria
export async function postVeterinaria(userData) {
    try {
        const response = await axios.post(`${url}/veterinaria`, userData);
        return response;
    } catch (error) {
        console.log(error);
    }
}

// GET veterinaria

export async function getVeterinarias() {
    try {
        const response = await axios({
            url: `${url}/veterinaria`,
            method: "GET",
        });
        return response.data; // Devuelve solo los datos (response.data)
    } catch (error) {
        console.error("Error al obtener veterinarias:", error);
        throw error; // Lanza el error para que pueda ser manejado en el componente.
    }
}

//GET  VETERINARIA POR ID

export async function getVeterinariaId(id) {
    try {
        const response = await axios({
            url: `${url}/veterinaria/${id}`,
            method: "GET",
        });
        return response.data; // Devuelve solo los datos (response.data)
    } catch (error) {
        console.error("Error al obtener veterinaria:", error);
        throw error; // Lanza el error para que pueda ser manejado en el componente.
    }
}

//GET  grilla cuidador
export async function getGrillaCuidador(id) {
    try {
        const response = await axios({
            url: `${url}/cuidadors/grilla/${id}`,
            method: "GET",
        });
        return response.data; // Devuelve solo los datos (response.data)
    } catch (error) {
        console.error("Error al obtener grilla:", error);
        throw error; // Lanza el error para que pueda ser manejado en el componente.
    }
}

//GET  grilla paseador
export async function getGrillaPaseador(id) {
    try {
        const response = await axios({
            url: `${url}/paseador/grilla/${id}`,
            method: "GET",
        });
        return response.data; // Devuelve solo los datos (response.data)
    } catch (error) {
        console.error("Error al obtener grilla:", error);
        throw error; // Lanza el error para que pueda ser manejado en el componente.
    }
}

// update paseador
export async function updatePaseador(id, data) {
    try {
        // Obtener los datos existentes de la mascota desde la API
        const existingPaseadorData = await getPaseadorPorId(id);

        // Combinar los datos existentes y los datos actualizados
        const updatedPaseadorData = {
            ...existingPaseadorData,
            ...data,
        };

        // Realizar la solicitud PUT para actualizar la mascota
        const response = await axios.put(
            `${url}/paseador/${id}`,
            updatedPaseadorData
        );

        return response;
    } catch (error) {
        console.log(error);
    }
}

//POST foto paseador
export async function postPaseadorFoto(userData) {
    try {
        const response = await axios.post(`${url}/paseadorFoto`, userData);
        return response;
    } catch (error) {
        console.log(error);
    }
}

// update cuidador
export async function updateCuidador(id, data) {
    try {
        // Obtener los datos existentes de la mascota desde la API
        const existingCuidadorData = await getCuidadoresId(id);

        // Combinar los datos existentes y los datos actualizados
        const updatedCuidadorData = {
            ...existingCuidadorData,
            ...data,
        };

        // Realizar la solicitud PUT para actualizar la mascota
        const response = await axios.put(
            `${url}/cuidadors/${id}`,
            updatedCuidadorData
        );

        return response;
    } catch (error) {
        console.log(error);
    }
}

//ELIMINAR foto paseador

export const deleteFotoPaseador = async (id) => {
    try {
        const response = await axios.delete(`${url}/paseadorFoto/${id}`);
        return response;
    } catch (error) {
        console.error(error);
    }
};

//ELIMINAR foto cuidador

export const deleteFotoCuidador = async (id) => {
    try {
        const response = await axios.delete(`${url}/cuidadorFoto/${id}`);
        return response;
    } catch (error) {
        console.error(error);
    }
};
//ELIMINAR foto posteo

export const deleteFotoPosteo = async (id) => {
    try {
        const response = await axios.delete(`${url}/publicacionMascotaFoto/${id}`);
        return response;
    } catch (error) {
        console.error(error);
    }
};


//POST foto PASEADOR
export async function postFotoPaseador(userData) {
    console.log(userData);
    try {
        const response = await axios.post(`${url}/paseadorFoto`, userData);
        return response;
    } catch (error) {
        console.log(error);
    }
}

//POST foto cuidador
export async function postFotoCuidador(userData) {
    console.log(userData);
    try {
        const response = await axios.post(`${url}/cuidadorFoto`, userData);
        return response;
    } catch (error) {
        console.log(error);
    }
}
//POST foto posteo
export async function postFotoPosteo(userData) {
    console.log(userData);
    try {
        const response = await axios.post(`${url}/publicacionMascotaFoto`, userData);
        return response;
    } catch (error) {
        console.log(error);
    }
}
//UPDATE grilla cuidador
export async function updateGrillaCuidador(id, userData) {
    try {
        const existingUserData = await getGrillaCuidador(id); // Obtener los datos existentes del usuario desde la API
        const updatedUserData = Object.assign(
            {},
            existingUserData.data,
            userData
        ); // Combinar los datos existentes y los datos actualizados

        const response = await axios.put(
            `${url}/cuidadors/grilla/${id}`,
            updatedUserData
        );
        return response;
    } catch (error) {
        console.log(error);
    }
}

//UPDATE grilla paseador
export async function updateGrillaPaseador(id, userData) {
    try {
        const existingUserData = await getGrillaPaseador(id); // Obtener los datos existentes del usuario desde la API
        const updatedUserData = Object.assign(
            {},
            existingUserData.data,
            userData
        ); // Combinar los datos existentes y los datos actualizados

        const response = await axios.put(
            `${url}/paseador/grilla/${id}`,
            updatedUserData
        );
        return response;
    } catch (error) {
        console.log(error);
    }
}

//UPDATE veterinaria
export async function updateVeterinaria(id, userData) {
    try {
        const existingUserData = await getVeterinariaId(id); // Obtener los datos existentes del usuario desde la API
        const updatedUserData = Object.assign(
            {},
            existingUserData.data,
            userData
        ); // Combinar los datos existentes y los datos actualizados

        const response = await axios.put(
            `${url}/veterinaria/${id}`,
            updatedUserData
        );
        return response;
    } catch (error) {
        console.log(error);
    }
}

//UPDATE estado veterinaraia
export async function updateEstadoVeterinaria(id, userData) {
    try {
        const response = await axios.put(
            `${url}/Veterinaria/estado/${id}`,
            userData
        );
        return response;
    } catch (error) {
        console.log(error);
    }
}

//UPDATE estado fundacion
export async function updateEstadoFundacion(id, userData) {
    try {
        const response = await axios.put(
            `${url}/fundacion/estado/${id}`,
            userData
        );
        return response;
    } catch (error) {
        console.log(error);
    }
}
//GET  horario veterinaria
export async function getHorarioVeterinaria(id) {
    try {
        const response = await axios({
            url: `${url}/veterinaria/horario/${id}`,
            method: "GET",
        });
        return response.data; // Devuelve solo los datos (response.data)
    } catch (error) {
        console.error("Error al obtener horarios:", error);
        throw error; // Lanza el error para que pueda ser manejado en el componente.
    }
}
//UPDATE horario veterinaria
export async function updateHorarioVeterinaria(id, userData) {
    try {
        const existingUserData = await getHorarioVeterinaria(id); // Obtener los datos existentes del usuario desde la API
        const updatedUserData = Object.assign(
            {},
            existingUserData.data,
            userData
        ); // Combinar los datos existentes y los datos actualizados

        const response = await axios.put(
            `${url}/veterinaria/horario/${id}`,
            updatedUserData
        );
        return response;
    } catch (error) {
        console.log(error);
    }
}

//GET  servicios veterinaria
export async function getServiciosVeterinaria(id) {
    try {
        const response = await axios({
            url: `${url}/veterinaria/servicio/${id}`,
            method: "GET",
        });
        return response.data; // Devuelve solo los datos (response.data)
    } catch (error) {
        console.error("Error al obtener servicios:", error);
        throw error; // Lanza el error para que pueda ser manejado en el componente.
    }
}
//UPDATE servicios veterinaria
export async function updateServicioVeterinaria(id, userData) {
    try {
        const existingUserData = await getServiciosVeterinaria(id); // Obtener los datos existentes del usuario desde la API
        const updatedUserData = Object.assign(
            {},
            existingUserData.data,
            userData
        ); // Combinar los datos existentes y los datos actualizados

        const response = await axios.put(
            `${url}/veterinaria/servicio/${id}`,
            updatedUserData
        );
        return response;
    } catch (error) {
        console.log(error);
    }
}

//UPDATE fundacion
export async function updateFundacion(id, userData) {
    try {
        const existingUserData = await getFundacionId(id); // Obtener los datos existentes del usuario desde la API
        const updatedUserData = Object.assign(
            {},
            existingUserData.data,
            userData
        ); // Combinar los datos existentes y los datos actualizados

        const response = await axios.put(
            `${url}/fundacion/${id}`,
            updatedUserData
        );
        return response;
    } catch (error) {
        console.log(error);
    }
}

//GET estados veterinaria
export async function getEstadosVeterinaria() {
    try {
        const response = await axios({
            url: `${url}/estadoveterinarias`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}





//POST fundacion
export async function postFundacion(userData) {
    try {
        const response = await axios.post(`${url}/fundacion`, userData);
        return response;
    } catch (error) {
        console.log(error);
    }
}

//GET fundacion
export async function getFundacion() {
    try {
        const response = await axios({
            url: `${url}/fundacion`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

//GET  FUNDACION POR ID

export async function getFundacionId(id) {
    try {
        const response = await axios({
            url: `${url}/fundacion/${id}`,
            method: "GET",
        });
        return response.data; // Devuelve solo los datos (response.data)
    } catch (error) {
        console.error("Error al obtener fundacion:", error);
        throw error; // Lanza el error para que pueda ser manejado en el componente.
    }
}


//UPDATE qr
export async function updateQrUsuario(id, qr) {
    try {
        const response = await axios.put(
            `${url}/usuario/qr/${id}`,
            qr
        );
        return response;
    } catch (error) {
        console.log(error);
    }
}


//ELIMINAR paseador

export const deletePaseador = async (paseadorId) => {
    try {
        const response = await axios.delete(`${url}/paseador/${paseadorId}`);
        return { success: true , response};
    } catch (error) {
        return { success: false , error};
    }
};

//ELIMINAR fundacion

export const deleteFundacion = async (fundacionId) => {
    try {
        const response = await axios.delete(`${url}/fundacion/${fundacionId}`);
        return { success: true , response};
    } catch (error) {
        return { success: false , error};
    }
};
//ELIMINAR veterinaria

export const deleteVeterinaria = async (veterinariaId) => {
    try {
        const response = await axios.delete(`${url}/veterinaria/${veterinariaId}`);
        return { success: true , response};
    } catch (error) {
        return { success: false , error};
    }
};



//ELIMINAR Cuidador

export const deleteCuidador = async (cuidadorId) => {
    try {
        const response = await axios.delete(`${url}/cuidadors/${cuidadorId}`);
        return { success: true , response};
    } catch (error) {
        return { success: false , error};
    }
};