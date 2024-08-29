import React, { Component } from 'react';
import Chart from 'react-apexcharts'

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
        <Chart options={{
            labels: labels,
          }}
          series={series}
          dataLabels
          type="donut" width="380" />
      </div>
    );
  }
}

export default RatioGraph;
