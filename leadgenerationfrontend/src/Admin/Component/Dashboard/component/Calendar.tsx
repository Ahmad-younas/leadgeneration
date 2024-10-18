import { Stack, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { AdminNavbarLink } from './Table/AdminNavbarLink';
import {
  getLastPathSegment,
  getSecondLastPathSegment,
} from '../../../../RoutePath/Path';
// import "../index.css";
import moment from 'moment';
import { ConfigureCalendar } from './ConfigureCalendar';
export const Calendar: React.FC = () => {
  const events = [
    {
      start: moment("2024-09-10 16:37:27").toDate(),
      end: moment("2024-09-10 16:37:27").toDate(),
      title: "Booked",
    },
    {
      start: moment().toDate(),
      end: moment().toDate(),
      title: "Insulated"
    },
    {
      start: moment().toDate(),
      end: moment().toDate(),
      title: "Insulated"
    },
    {
      start: moment().toDate(),
      end: moment().toDate(),
      title: "Canceled"
    },
    {
      start: moment().toDate(),
      end: moment().toDate(),
      title: "Submitted"
    }
  ]
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 19);

  console.log(formattedDate);
  const backGroundColor = useColorModeValue('white', 'white');
  const navbarIcon = useColorModeValue('gray.500', 'gray.200');
  const mainText = useColorModeValue('gray.700', 'gray.200');
  const secondaryText = useColorModeValue('gray.700', 'white');
  return (
    <React.Fragment>
      <AdminNavbarLink brandText={getSecondLastPathSegment(window.location.pathname)}
                       brandTextS={getLastPathSegment(window.location.pathname)}
                       mainTextColor={mainText}
                       secondaryTextColor={secondaryText}
                       navbarIconColor={navbarIcon}
                       backgroundColor={backGroundColor}/>
        <ConfigureCalendar events={events} views={["day", "month", "week", "work_week"]}/>
    </React.Fragment>
  );
};
