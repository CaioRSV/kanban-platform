import React, { Component } from 'react';
import Chart from 'react-apexcharts'

interface RatioGraphProps {
  series: number[];
  labels: string[];
}

class RatioGraph extends Component<RatioGraphProps> {

  render() {
    const { series, labels } = this.props;

    return (
      <div className="donut">
        <Chart options={{
            labels: labels,
          }}
          series={series}
          
          type="donut" width="380" />
      </div>
    );
  }
}

export default RatioGraph;
