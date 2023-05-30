import axios from "axios";
const url = "https://localhost:7253/api";

//GET
export async function getUser () {
  try {
    const response = await axios({
      url: `${url}/usuario`,
      method: 'GET'
    })

    return response
  } catch (error) {
    console.log(error)
  }
}
export async function getUserId (id) {
  try {
    const response = await axios({
      url: `${url}/usuario/${id}`,
      method: 'GET'
    })

    return response
  } catch (error) {
    console.log(error)
  }
}
export async function getUserMail(mail){
  try {
    const response = await axios({
      url: `${url}/usuario/mail/${mail}`,
      method: 'GET'
    })
    return response.data
  } catch (error) {
    console.log(error)
  }
}
export async function getBarrioUser(id){
  try {
    const response = await axios({
      url: `${url}/barrio/${id}`,
      method: 'GET'
    })
    return response.data
  } catch (error) {
    console.log(error)
  }
}
export async function getCiudadUser(id){
  try {
    const response = await axios({
      url: `${url}/ciudad/${id}`,
      method: 'GET'
    })
    return response.data
  } catch (error) {
    console.log(error)
  }
}

//POST
export async function postUser (userData) {
  try {
    const response = await axios.post(`${url}/usuario`, userData);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
}

//UPDATE
export async function updateUser(id, userData) {
  try {
    const existingUserData = await getUserId(id); // Obtener los datos existentes del usuario desde la API
    const updatedUserData = Object.assign({}, existingUserData.data, userData); // Combinar los datos existentes y los datos actualizados
  
    console.log(existingUserData)
    console.log(updatedUserData)

    const response = await axios.put(`${url}/usuario/${id}`, updatedUserData);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error) 
  }
}
