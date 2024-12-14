import React from 'react'
import { getInitials } from '../../utils/helper'

const ProfileInfo = ({userInfo,onLogOut}) => {
 
  return (
    userInfo && (<div className='flex items-center gap-3'>
        <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100 border border-teal-800">
            {getInitials(userInfo? userInfo.fullName: "")}
        </div>

        <div>
            <p className='text-sm font-medium'>{userInfo.name || ""}</p>
            <button className='text-bold text-teal-700' onClick={onLogOut}>LogOut</button>
        </div>
    </div>)
  )
}

export default ProfileInfo