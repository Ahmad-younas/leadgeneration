import { useColorModeValue } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { EmployeeNavbarLink } from './EmployeeNavbarLink';
import {
  getLastPathSegment,
  getSecondLastPathSegment,
} from '../RoutePath/Path';
// import "../index.css";
import { ConfigureCalendar } from './ConfigureCalendar';
import moment from 'moment';
import axios from 'axios';

interface Event {
  start: Date;
  end: Date;
  title: string;
  id: number;
}

export const Calendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const token = localStorage.getItem('authToken');
  const backGroundColor = useColorModeValue('white', 'white');
  const navbarIcon = useColorModeValue('gray.500', 'gray.200');
  const mainText = useColorModeValue('gray.700', 'gray.200');
  const secondaryText = useColorModeValue('gray.700', 'white');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3002/api/getJobStatusById',
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ); // Adjust the URL and ID as needed
        const { usersWithJobs } = response.data;
        console.log('data', usersWithJobs);
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

        console.log('mappedEvent', mappedEvents);
        setEvents(mappedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);
  console.log('events', events);
  return (
    <React.Fragment>
      <EmployeeNavbarLink
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
