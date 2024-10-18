import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { lineChartOptions } from '../general';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

// Define the types for the state
interface JobCount {
  total_jobs_on_each_month: number;
  month_name: string;
}

const LineChart: React.FC = () => {
  // State management using useState hook
  const [chartData, setChartData] = useState<Array<any>>([]);
  const [chartOptions] = useState<object>(lineChartOptions); // Static options
  const user = useSelector((state: RootState) => state.auth.user);
  const id = user?.id;
  const monthOrder = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

// Sort the data based on the correct month order
  useEffect(() => {
    // Fetch data on component mount
    const fetchJobCounts = async () => {
      try {
        // Call the API to get total jobs per month
        const response = await axios.get('http://localhost:3002/api/getMonthlyJobCountOfEmployee', {
          params: {
            id
          },
        });

        // Assuming the API returns an array of job counts like [5, 10, 15, ...]
        const sortedData: JobCount[] = response.data.sort((a: JobCount, b: JobCount) => {
          return monthOrder.indexOf(a.month_name) - monthOrder.indexOf(b.month_name);
        });
        console.log(response.data);
        const jobCounts = sortedData.map((item:JobCount) => item.total_jobs_on_each_month);
        console.log("JobCounts", jobCounts);

        // Update the chart data with the API response
        setChartData([
          {
            name: 'Total Jobs',
            data: jobCounts, // Set the data from the API
          },
        ]);
      } catch (error) {
        console.error('Error fetching job counts:', error);
      }
    };

    fetchJobCounts(); // Invoke the function to fetch data
  }, []); // Empty dependency array to run only on component mount

  return (
    <ReactApexChart
      options={chartOptions}
      series={chartData}
      type="area"
      width="100%"
      height="100%"
    />
  );
};

export default LineChart;
