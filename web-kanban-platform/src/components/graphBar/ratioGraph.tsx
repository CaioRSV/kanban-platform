import React, { Component } from 'react';
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface RatioGraphProps {
  series: number[];
  labels: string[];
  theme: string;
}

class RatioGraph extends Component<RatioGraphProps> {
  render() {
    const { series, labels, theme } = this.props;

    return (
      <div className="donut">
        {(typeof window !== 'undefined') &&
          <Chart options={{
            labels: labels,
            colors:['#ebb400', '#00eb2f', '#0066eb'],
            legend: {
              labels: {
                colors: theme=='dark' ? Array(labels.length).fill('#f8f8f8') : []
              }
            }
          }}
          series={series}
          type="donut" width="380" />
        }
      </div>
    );
  }
}

export default RatioGraph;
