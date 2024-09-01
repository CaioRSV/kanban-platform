import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'


import {
    LineChart
  } from "react-native-chart-kit";

import {Dimensions} from 'react-native';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface DoneLineGraphProps{
  labels: string[];
  series: number[];
  theme: string;
}

const DoneLineGraph = (props: DoneLineGraphProps) => {

  const data = {
    labels: props.labels ?? ["Fall", "Back"],
    datasets: [
      {
        data: props.series ?? [1, 3],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2 
      }
    ],
    legend: ["Tarefas feitas ao longo do tempo"]
  };


  return (
    <View>
        <LineChart
        data={data}
        width={windowWidth-20}
        height={windowHeight/3}
        chartConfig={{
            backgroundGradientFrom: props.theme=='dark' ? 'rgba(0,0,0,0)' : '#ffffff',
            backgroundGradientTo: props.theme=='dark' ? '#000000' : '#ffffff',
            decimalPlaces: 2,
            color: props.theme=='dark' ? ((opacity = 1) => `rgba(255, 255, 255, ${opacity})`) : ((opacity = 1) => `rgba(0, 0, 0, ${opacity})`),
            labelColor: props.theme=='dark' ? ((opacity = 1) => `rgba(255, 255, 255, ${opacity})`) : ((opacity = 1) => `rgba(0, 0, 0, ${opacity})`),
            style: {
            borderRadius: 16
            },
            propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726"
            }
        }}
        />
    </View>
  )
}

export default DoneLineGraph