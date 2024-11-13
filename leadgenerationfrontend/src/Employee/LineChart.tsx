import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { lineChartOptions } from '../general';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { ENDPOINTS } from '../utils/apiConfig';
import { logout } from '../redux/authSlice';

// Define the types for the state
interface JobCount {
  total_jobs_on_each_month: number;
  month_name: string;
}

const LineChart: React.FC = () => {
  const token = localStorage.getItem('authToken');
  const [chartData, setChartData] = useState<Array<any>>([]);
  const [chartOptions] = useState<object>(lineChartOptions); // Static options
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const id = user?.id;
  const monthOrder = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Sort the data based on the correct month order
  useEffect(() => {
    // Fetch data on component mount
    const fetchJobCounts = async () => {
      try {
        // Call the API to get total jobs per month
        const response = await axios.get(
          ENDPOINTS.getMonthlyJobCountOfEmployee,
          {
            params: {
              id,
            },
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const sortedData: JobCount[] = response.data.sort(
          (a: JobCount, b: JobCount) => {
            return (
              monthOrder.indexOf(a.month_name) -
              monthOrder.indexOf(b.month_name)
            );
          }
        );
        const jobCounts = sortedData.map(
          (item: JobCount) => item.total_jobs_on_each_month
        );
        setChartData([
          {
            name: 'Total Jobs',
            data: jobCounts, // Set the data from the API
          },
        ]);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (
            error?.response?.status === 403 ||
            error?.response?.status === 401
          ) {
            dispatch(logout());
          }
        }
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
