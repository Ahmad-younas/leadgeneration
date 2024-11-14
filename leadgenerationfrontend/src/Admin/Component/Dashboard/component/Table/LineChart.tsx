import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { lineChartOptions } from '../../../../../general';
import axios from 'axios';
import { ENDPOINTS } from '../../../../../utils/apiConfig';

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
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get(ENDPOINTS.getMonthlyCountJob, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const jobCounts = response.data.map(
        (item: JobCount) => item.total_jobs_on_each_month
      );
      this.setState({
        chartData: [
          {
            name: 'Total Jobs',
            data: jobCounts, // Set the data from the API
          },
        ],
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.status === 403 ||
          error?.response?.status === 401
        ) {
          //dispatch(logout());
        }
      }
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
