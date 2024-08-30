import { useTheme } from "next-themes";
import React, { Component } from "react";

import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface DoneLineGraphProps{
    series: number[];
    labels: string[];
    theme: string;
}

class DoneLineGraph extends Component<DoneLineGraphProps> {
  render() {
    const { series, labels, theme} = this.props;
    return (
      <div className="app">
        <div className="row">
          <div className="mixed-chart">
          {(typeof window !== 'undefined') &&
            <Chart
            options={{
              chart: {
                  id: 'done-line_chart'
              },
              xaxis: {
                  categories: labels,
                  labels:{
                    style:{
                      colors: theme=='dark' ? Array(labels.length).fill('#f8f8f8') : []
                    }
                  }
              },
              tooltip: {
                theme: 'dark'
              }
            }}
            series={[
              {
                  name: "quantitativo",
                  data: series
              }
            ]}
            type="line"
            width="500"
            dataLabels={{
              enabled: true,
              style:{
                  colors: ['#33FF57'],
                }
            }}
          />
          }

          </div>
        </div>
      </div>
    );
  }
}

export default DoneLineGraph;