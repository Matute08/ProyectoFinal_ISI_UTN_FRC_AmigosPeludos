import axios from "axios";
const url = "https://localhost:7253/api/usuario";

const getUsuarios = async () =>{
 
    const response = await axios.get(url);
    console.log(response);
}

export{
  getUsuarios
}