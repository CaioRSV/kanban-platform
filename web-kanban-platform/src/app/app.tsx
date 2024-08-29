'use client';

import React, { useState, useEffect } from 'react';

import SetUserModal from '@/components/setUserModal';
import TopBar from '@/components/topBar';
import Workspace from '@/components/dragNdrop/workspace';
import FinishColumn from '@/components/finishColumn';

import { useUserContext } from '@/components/contexts/userContext';
import SaveColumns from '@/components/saveColumns';
import { useTaskContext } from '@/components/contexts/tasksContext';


export default function App() {
  const {
    user, setUser, id, setId, 
    setColumn1_name, 
    setColumn2_name, 
    setColumn3_name,
    setColumn1, column1,
    setColumn2, column2,
    setColumn3, column3
  } = useUserContext();

  const {tasksLocal, setTasksLocal} = useTaskContext();
  
  return (
        <main style={{filter: user ? `` : `blur(3px)`}} className="min-h-screen p-12 flex flex-col transition-all duration-500">
          <SetUserModal/>
          <div className={`w-full h-fit flex justify-center items-center`}>
            <TopBar/>
          </div>
          <div className="flex-1 flex-col w-full h-full flex justify-center items-center">


            <div className={`flex w-[80%] justify-end pt-4 pb-4`}>
              <SaveColumns/>
            </div>

            <div className={`w-[80%] h-full flex justify-center items-center gap-4`}>
              <Workspace/>
            </div>

            {/* <div className={`flex w-[80%] justify-end pt-4 pb-4`}>
              <FinishColumn/>
            </div> */}

            

          </div>
        
        </main>
  );
}
