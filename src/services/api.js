import axios from "axios";
const url = "https://localhost:7253/api";

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
            url: `${url}/usuario/mail/${mail}`,
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

//GET CIUDAD
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

//GET DATOS DE MASCOTAS CON ID
export async function getMascotaId(id) {
    try {
        const response = await axios({
            url: `${url}/mascota/${id}`,
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
            url: `${url}/mascota/usuario/${idUsuario}`,
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




//POST
export async function postUser(userData) {
    console.log(userData)
    try {
        const response = await axios.post(`${url}/usuario`, userData);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
    }
}
export async function postUserWithGoogle(userData) {
    console.log(userData)
    try {
        const response = await axios.post(`${url}/usuario`, userData);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function postMascota(userData) {
    console.log(userData)
    try {
        const response = await axios.post(`${url}/mascota`, userData);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
    }
}



//UPDATE
export async function updateUser(id, userData) {
    console.log(id)
    console.log(userData)
    try {
        const existingUserData = await getUserId(id); // Obtener los datos existentes del usuario desde la API
        const updatedUserData = Object.assign(
            {},
            existingUserData.data,
            userData
        ); // Combinar los datos existentes y los datos actualizados

        console.log(existingUserData);
        console.log(updatedUserData);

        const response = await axios.put(
            `${url}/usuario/${id}`,
            updatedUserData
        );
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
    }
}
