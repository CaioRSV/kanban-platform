import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native'

import Provider from "./components/Provider";

import Main from './components/Main';

import { GestureHandlerRootView } from "react-native-gesture-handler";


export default function Home() {
  return (
      <Provider>
        <GestureHandlerRootView>
          <Main/>
        </GestureHandlerRootView>
      </Provider>
  );
}