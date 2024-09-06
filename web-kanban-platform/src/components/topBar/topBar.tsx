import React from 'react'
import GithubHandle from '@/components/topBar/githubHandle';
import ThemeSwitch from '@/components/topBar/themeSwitch';
import UserHandle from './userHandle';

// GithubHandle: HoverCard com info sobre desenvolvedor
// UserHandle: Label com ContextMenu para permitir troca de usuários sem recarregar a página
// ThemeSwitch: Switch que permite troca de tema

const TopBar = () => {
  return (
    <div className={`w-[80%] flex justify-center items-center gap-2`}>       
        <GithubHandle/>
        
        <div className={`flex-1 flex justify-center items-center`}>
          <UserHandle/>
        </div>

        <ThemeSwitch/>
    </div>
  )
}

export default TopBar