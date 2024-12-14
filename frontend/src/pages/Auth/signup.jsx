import React from 'react'
import { useState } from 'react';
import PasswordInput from "../../components/Input/PasswordInput";
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!fullName) {
      setError("Enter your name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Enter a valid email");
      return;
    }
    if (!password) {
      setError("Enter the password");
      return;
    }
    setError("");

    //SignUp API call
    try {
      const res = await axiosInstance.post("/signup", {
        fullName:fullName,
        email: email,
        password: password,
      });

      if (res.data && res.data.accessToken) {
        localStorage.setItem("token", res.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.res && error.res.data && error.res.data.message) {
        setError(error.res.data.message);
      } else {
        setError("Unexpected error occurred");
      }
    }
  };

  return (
    <div className="h-screen bg-teal-50 overflow-hidden relative">

      <div className="SignUp-ui-box right-10 -top-40"></div>
      <div className="SignUp-ui-box bg-teal-500 -bottom-40 right-1/2"></div>
      <div className="container h-screen flex items-center justify-center px-20 mx-auto">
        <div className="w-2/4 h-[90vh] flex items-end bg-signup-bg-img bg-cover bg-center rounded-lg p-10 z-50">
          <div>
            <h4 className="text-5xl font-semibold leading-[58px]">
              Explore the blog
            </h4>
            <p className="text-[15px] leading-6 pr-7 mt-4">
              Open an account to share your knowldege and treasure it
            </p>
          </div>
        </div>

        <div className="h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20">
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl font-semibold mb-7">SignUp</h4>
            <input type="text" placeholder="Name" className="input-box"
              value={fullName}
              onChange={(e) => { setFullName(e.target.value) }}
            />
            <input type="text" placeholder="Email" className="input-box"
              value={email}
              onChange={(e) => { setEmail(e.target.value) }}
            />
            <PasswordInput
              value={password}
              onChange={(e) => { setPassword(e.target.value) }}
            />

            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
            <button type="submit" className="btn-primary">CREATE ACCOUNT</button>
            <p className="text-xs text-slate-500 text-center my-4">Or</p>
            <button
              type="submit"
              className="btn-primary btn-light"
              onClick={() => {
                navigate("/login");
              }}
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp;