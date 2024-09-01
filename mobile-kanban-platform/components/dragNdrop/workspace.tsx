"use client";

import React, { useState, useCallback, useRef } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import Column from "./column";
import { useUserContext } from "../contexts/userContext";

interface WorkspaceProps{
  theme: string;
}

const Workspace = (props: WorkspaceProps) => {

  const {
    user, setUser, id, setId, 
    setSelectedColumn, selectedColumn,
    setColumn1_name, column1_name,
    setColumn2_name, column2_name,
    setColumn3_name,column3_name,
    setColumn1, column1,
    setColumn2, column2,
    setColumn3, column3
  } = useUserContext();

  return (
    <View>
    
    {
      selectedColumn=="column1" && 
      <Column name={column1_name} idServer={1} isDone={false} theme={props.theme}/>
    }

    {
      selectedColumn=="column2" && 
      <Column name={column2_name}  idServer={2} isDone={false} theme={props.theme}/>
    }

    {
      selectedColumn=="column3" && 
      <Column name={column3_name}  idServer={3} isDone={true} theme={props.theme}/>
    }

    <View style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <View style={{
        marginTop: 10,
        width: '80%',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "gray",
        padding: 2,
        flexDirection: 'row',
        height: 40
      }}>
        <TouchableOpacity onPress={()=>{setSelectedColumn('column1')}} style={{backgroundColor: selectedColumn=='column1' ? 'rgba(125,125,125,0.2)' : 'rgba(0,0,0,0)',  flex: 1, borderRightWidth: 1, borderColor: 'gray', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: props.theme=='dark' ? 'white' : 'black'}}>1</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>{setSelectedColumn('column2')}} style={{backgroundColor: selectedColumn=='column2' ? 'rgba(125,125,125,0.2)': 'rgba(0,0,0,0)',flex: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'gray', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: props.theme=='dark' ? 'white' : 'black'}}>2</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>{setSelectedColumn('column3')}} style={{backgroundColor: selectedColumn=='column3' ? 'rgba(125,125,125,0.2)': 'rgba(0,0,0,0)',flex: 1, borderLeftWidth: 1, borderColor: 'gray', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: props.theme=='dark' ? 'white' : 'black'}}>3</Text>
        </TouchableOpacity>

      </View>
    </View>

    </View>
  )
}

export default Workspace