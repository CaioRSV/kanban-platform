'use client';

import React, { useState, useEffect } from 'react';

import Provider from "./Provider";

import SetUserModal from '@/components/setUserModal';
import TopBar from '@/components/topBar';
import Workspace from '@/components/dragNdrop/workspace';



export default function Home() {
  return (
      <Provider
        defaultTheme="system"
        attribute="class"
      >
        <main className="min-h-screen p-12 flex flex-col transition-all duration-500">
          <SetUserModal/>
          <div className={`w-full h-fit flex justify-center items-center`}>
            <TopBar/>
          </div>
          <div className="flex-1 w-full h-full flex justify-center items-center">
            
            <div className={`w-[80%] h-full flex justify-center items-center gap-4`}>
              <Workspace/>
            </div>

          </div>
        
        </main>
      </Provider>
  );
}
