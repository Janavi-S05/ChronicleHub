import React from 'react'
import { useState } from 'react';
import PasswordInput from "../../components/Input/PasswordInput";
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if(!validateEmail(email))
    {
      setError("Enter a valid email");
      return;
    }
    if(!password){
      setError("Enter the password");
      return;
    }
    setError("");
    
    //login API call
    try{
      const res = await axiosInstance.post("/login",{
        email:email,
        password:password,
      });

      if(res.data && res.data.accessToken){
        localStorage.setItem("token", res.data.accessToken);
        navigate("/dashboard");
      }
    }catch(error)
    {
      if(error.res && error.res.data && error.res.data.message){
        setError(error.res.data.message);
      }else{
        setError("Unexpected error occurred");
      }
    }
  };
  
  return (
    <div className="h-screen bg-teal-50 overflow-hidden relative">

      <div className="login-ui-box bg-teal-400 right-10 -top-40"></div>
      <div className="login-ui-box bg-teal-400 -bottom-40 right-1/2"></div>
      <div className="container h-screen flex items-center justify-center px-20 mx-auto">
        <div className="w-2/4 h-[90vh] flex items-end bg-login-bg-img bg-cover bg-center rounded-lg p-10 z-50">
          <div>
            <h4 className="text-5xl font-semibold leading-[58px]">
              Discover. Learn. Grow.
            </h4>
            <p className="text-[15px] leading-6 pr-7 mt-4">
              Believe in the power of words to Connect, Educate, and Inspire
            </p>
          </div>
        </div>

        <div className="w-2.75/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-teal-200/20">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl font-semibold mb-7">Login</h4>
            <input type="text" placeholder="Email" className="input-box"
              value={email}
              onChange={(e) => { setEmail(e.target.value) }}
            />
            <PasswordInput
              value={password}
              onChange={(e) => { setPassword(e.target.value) }} 
            />

            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
            <button type="submit" className="btn-primary">LOGIN</button>
            <p className="text-xs text-slate-500 text-center my-4">Or</p>
            <button
              type="submit"
              className="btn-primary btn-light"
              onClick={() => {
                navigate("/signup");
              }}
            >
              CREATE ACCOUNT
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;