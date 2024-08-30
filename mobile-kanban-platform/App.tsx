import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native'

import Provider from "./components/Provider";

import Main from './components/Main';

export default function Home() {
  return (
      <Provider>
        <Main/>
      </Provider>
  );
}