import { View, Text } from 'react-native'
import React from 'react'

import {
    PieChart,
  } from "react-native-chart-kit";

import {Dimensions} from 'react-native';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;




interface RatioGraphProps{
  column1: number[];
  column1_name: string;

  column2: number[];
  column2_name: string;

  column3: number[];
  column3_name: string;
}

const RatioGraph = (props: RatioGraphProps) => {

  const data = [
    {
      name: props.column1_name,
      quantity: props.column1.length,
      color: "rgba(235, 180, 0, 0.8)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: props.column2_name,
      quantity: props.column2.length,
      color: "rgba(0, 235, 47, 0.8)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: props.column3_name,
      quantity: props.column3.length,
      color: "rgba(0, 102, 235, 0.8)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
  ];

  return (
        <PieChart
            data={data}
            width={windowWidth/1}
            height={windowHeight/3.0}
            chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#fb8c00",
                backgroundGradientTo: "#ffa726",
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                borderRadius: 16
                },
                propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726"
                }
            }}
            accessor={"quantity"}
            backgroundColor={"transparent"}
            paddingLeft={"0"}
            center={[20, 0]}
            absolute
        />
  )
}

export default RatioGraph