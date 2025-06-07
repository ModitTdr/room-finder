import { useEffect, useState } from "react"
import {jwtDecode} from "jwt-decode";
import axios from "axios";

const Homepage = () => {
  const [token,setToken] = useState()
  const [name,setName] = useState()
  
  useEffect(()=>{
    setToken(localStorage.getItem("token"));
  },[]);
  
  useEffect(()=>{
    const getUser = async () => {
      if(token){
        try{
          const decoded = jwtDecode(token);
          const response = await axios.get(
            `http://localhost:3000/api/users/${decoded.id}`,
            {
              headers:{
                Authorization: `Bearer ${token}`,
              }
            }
          );
          if(response){
            setName(response.data.data.name.split(' ')[0]);
          }
        }catch(error){
          console.log(error.response);
        }
      }
    }
    getUser();
  },[token]);
  
  return (
    <div>
      hi {name}
    </div>
  )
}
export default Homepage