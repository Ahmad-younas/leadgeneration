import React from 'react';
import ReactApexChart from 'react-apexcharts';
import {lineChartOptions } from '../../../../../general';
import axios from 'axios';

// Define the types for the state
interface LineChartState {
  chartData: Array<any>;
  chartOptions: object;
}
interface JobCount {
  total_jobs_on_each_month: number;
}

export class LineChart extends React.Component<{}, LineChartState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      chartData: [],
      chartOptions: lineChartOptions,
    };
  }

  async componentDidMount() {
    try {
      // Call the API to get total jobs per month
      const response = await axios.get('http://localhost:3002/api/get-monthly-count-job'); // Adjust the API endpoint as necessary
      const jobCounts = response.data.map((item:JobCount) => item.total_jobs_on_each_month);

      // Update the chart data with the API response
      this.setState({
        chartData: [
          {
            name: 'Total Jobs',
            data: jobCounts, // Set the data from the API
          }
        ],
      });
    } catch (error) {
      console.error('Error fetching job counts:', error);
    }
  }

  render() {
    return (
      <ReactApexChart
        options={this.state.chartOptions}
        series={this.state.chartData}
        type="area"
        width="100%"
        height="100%"
      />
    );
  }
}
