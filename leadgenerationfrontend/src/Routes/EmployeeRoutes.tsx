import {
  AddJobsIcon,
  CalendarIcon,
  HomeIcon,
  JobIcon,
} from '../Components/Icons/Icons';

import { Dashboard } from '../Employee/Dashboard';
import { AddJobs } from '../Employee/AddJobs';
import { Jobs } from '../Employee/Jobs';
import { Calendar } from '../Employee/Calendar';

export let EmployeeRoutes = [
  {
    path: '',
    name: 'Dashboard',
    icon: <HomeIcon color="inherit" />,
    component: Dashboard,
    layout: '/employee',
  },

  {
    path: '/addjobs',
    name: 'Add Jobs',
    icon: <AddJobsIcon color="inherit" />,
    component: AddJobs,
    layout: '/employee',
  },
  {
    path: '/jobs',
    name: 'Jobs',
    icon: <JobIcon color="inherit" />,
    component: Jobs,
    layout: '/employee',
  },
  {
    path: '/calendar',
    name: 'Calendar',
    icon: <CalendarIcon color="inherit" />,
    component: Calendar,
    layout: '/employee',
  },
];
