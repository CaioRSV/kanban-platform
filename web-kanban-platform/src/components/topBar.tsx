import React from 'react'
import GithubHandle from '@/components/githubHandle';
import ThemeSwitch from '@/components/themeSwitch';
import UserHandle from './userHandle';

const TopBar = () => {
  return (
    <div className={`w-[80%] flex justify-center items-center gap-2`}>       
        <GithubHandle/>
        <div className={`flex-1 flex justify-center items-center`}>

        <UserHandle></UserHandle>

        </div>
        <ThemeSwitch/>
    </div>
  )
}

export default TopBar