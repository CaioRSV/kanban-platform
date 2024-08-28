'use client';

import React, { useState, useEffect } from 'react';

import Provider from "./Provider";

import SetUserModal from '@/components/setUserModal';
import TopBar from '@/components/topBar';
import Workspace from '@/components/dragNdrop/workspace';
import FinishColumn from '@/components/finishColumn';

import App from '@/app/app';


export default function Home() {
  return (
      <Provider
        defaultTheme="system"
        attribute="class"
      >
        <App/>
      </Provider>
  );
}
