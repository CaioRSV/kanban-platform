import { useTheme } from "next-themes";
import React, { Component } from "react";
import Chart from "react-apexcharts";

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
                subtitle: {
                  style:{
                    color: '#45ff00'
                  }
                }
              }}
              series={[
                {
                    name: "series-1",
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
          </div>
        </div>
      </div>
    );
  }
}

export default DoneLineGraph;