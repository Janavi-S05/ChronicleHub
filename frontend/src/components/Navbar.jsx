import React from 'react'
import LOGO from "../assets/techBrew.png"
import ProfileInfo from './Cards/ProfileInfo'
import { useNavigate } from 'react-router-dom'
import SearchBar from './Input/SearchBar'

const Navbar = ({ userInfo, search, setSearch, onSearchBlog, handleClearSearch}) => {
  const isToken = localStorage.getItem("token");
  const navigate = useNavigate();

  const onLogOut = () => {
    localStorage.clear();
    navigate("/login");
  }

  const handleSearch = () => {
    if (search) {
      onSearchBlog(search);
    }
  }

  const onClearSearch = () => {
    handleClearSearch();
    setSearch("");
  }

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10'>
      {/* <img src={LOGO} alt="blog" className='h-12 w-50' /> */}
      <h3 className='h-12 w-50 font-large pl-10 text-teal-800 animate-pulse ' style={{ fontSize: "1.75rem" }} >Cₕᵣₒₙᵢcₗₑₕᵤb</h3>
      {isToken && (
        <>
          <SearchBar
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />

          <ProfileInfo userInfo={userInfo} onLogOut={onLogOut} />
        </>
      )}
    </div>
  )
}

export default Navbar