import { View, Text } from 'react-native'
import React from 'react'


import {
    LineChart
  } from "react-native-chart-kit";

import {Dimensions} from 'react-native';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: ["Rainy Days"] // optional
  };


const DoneLineGraph = ({theme}) => {
  return (
    <View>
        <LineChart
        data={data}
        width={windowWidth-20}
        height={220}
        chartConfig={{
            backgroundGradientFrom: theme=='dark' ? 'rgba(0,0,0,0)' : '#ffffff',
            backgroundGradientTo: theme=='dark' ? '#000000' : '#ffffff',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: theme=='dark' ? ((opacity = 1) => `rgba(255, 255, 255, ${opacity})`) : ((opacity = 1) => `rgba(0, 0, 0, ${opacity})`),
            labelColor: theme=='dark' ? ((opacity = 1) => `rgba(255, 255, 255, ${opacity})`) : ((opacity = 1) => `rgba(0, 0, 0, ${opacity})`),
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