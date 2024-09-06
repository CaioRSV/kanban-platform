import React from 'react';

import Provider from "./Provider";

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
