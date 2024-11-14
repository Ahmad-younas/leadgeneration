import { useColorModeValue } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { AdminNavbarLink } from './Table/AdminNavbarLink';
import {
  getLastPathSegment,
  getSecondLastPathSegment,
} from '../../../../RoutePath/Path';
import moment from 'moment';
import { ConfigureCalendar } from './ConfigureCalendar';
import axios from 'axios';
import { logout } from '../../../../redux/authSlice';
import { useDispatch } from 'react-redux';

interface Event {
  start: Date;
  end: Date;
  title: string;
  id: number;
}

export const Calendar: React.FC = () => {
  const backGroundColor = useColorModeValue('white', 'white');
  const navbarIcon = useColorModeValue('gray.500', 'gray.200');
  const mainText = useColorModeValue('gray.700', 'gray.200');
  const secondaryText = useColorModeValue('gray.700', 'white');
  const dispatch = useDispatch();
  const [events, setEvents] = useState<Event[]>([]);
  const token = localStorage.getItem('authToken');
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3002/api/getAllJobStatus',
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ); // Adjust the URL and ID as needed
        const usersWithJobs = response.data;
        const mappedEvents = Array.isArray(usersWithJobs)
          ? usersWithJobs.map(
              (job: {
                status: string;
                job_creation_date: string;
                id: number;
              }) => ({
                start: moment(job.job_creation_date).toDate(),
                end: moment(job.job_creation_date).toDate(),
                title: job.status,
                id: job.id,
              })
            )
          : [
              {
                start: moment(usersWithJobs.start).toDate(),
                end: moment(usersWithJobs.start).toDate(),
                title: usersWithJobs.status,
                id: usersWithJobs.id,
              },
            ];
        setEvents(mappedEvents);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (
            error?.response?.status === 403 ||
            error?.response?.status === 401
          ) {
            dispatch(logout());
          }
        }
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);
  return (
    <React.Fragment>
      <AdminNavbarLink
        brandText={getSecondLastPathSegment(window.location.pathname)}
        brandTextS={getLastPathSegment(window.location.pathname)}
        mainTextColor={mainText}
        secondaryTextColor={secondaryText}
        navbarIconColor={navbarIcon}
        backgroundColor={backGroundColor}
      />
      <ConfigureCalendar
        events={events}
        views={['day', 'month', 'week', 'work_week']}
      />
    </React.Fragment>
  );
};
