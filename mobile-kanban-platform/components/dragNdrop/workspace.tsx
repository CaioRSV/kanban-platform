import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import Column from "./column";
import { useUserContext } from "../contexts/userContext";
import { GraphQLSchema } from "graphql";

interface WorkspaceProps{
  theme: string;
  schema?: GraphQLSchema;
}

const Workspace = (props: WorkspaceProps) => {
  const {
    setSelectedColumn, selectedColumn,
    column1_name,
    column2_name,
    column3_name,
  } = useUserContext();

  const selectedColumnObject = {
    "column1" : <Column name={column1_name} idServer={1} isDone={false} theme={props.theme} schema={props.schema} />,
    "column2" : <Column name={column2_name}  idServer={2} isDone={false} theme={props.theme} schema={props.schema}/>,
    "column3" : <Column name={column3_name}  idServer={3} isDone={true} theme={props.theme} schema={props.schema}/>
  }

  return (
    <View>
      { selectedColumnObject[selectedColumn] }

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