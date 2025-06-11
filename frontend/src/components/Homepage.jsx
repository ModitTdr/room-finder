import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useSelector } from "react-redux";

const Homepage = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const data = useSelector((state) => state.auth.userData);

  return (
    <div>
      hi {isLoggedIn?'user':'guest'}
    </div>
  )
}
export default Homepage