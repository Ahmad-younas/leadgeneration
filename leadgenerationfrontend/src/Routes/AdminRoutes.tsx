import { Dashboard } from '../Admin/Component/Dashboard/component/Dashboard';
//import {Employees} from "./Admin/Component/Dashboard/component/Employees";
import {
  HomeIcon,
  StatsIcon,
  SettingsIcon,
  EmployeeIcon,
  AllJobsIcon, AddJobsIcon, CalendarIcon,
} from '../Components/Icons/Icons';
import { Employees } from '../Admin/Component/Dashboard/component/Employees';
import { Setting } from '../Admin/Component/Dashboard/component/Setting';
import { AllJobs } from '../Admin/Component/Dashboard/component/AllJobs';
import { AddJobs } from '../Employee/AddJobs';
import { Calendar } from '../Admin/Component/Dashboard/component/Calendar';

export let dashRoutes = [
  {
    path: '',
    name: 'Dashboard',
    icon: <HomeIcon color='inherit' />,
    component: Dashboard,
    layout: '/admin',
  },

  {
    path: '/employee',
    name: 'Employee',
    icon: <EmployeeIcon color='inherit' />,
    component: Employees,
    layout: '/admin',
  },
  {
    path: '/alljobs',
    name: 'All Jobs',
    icon: <AllJobsIcon color='inherit' />,
    component: AllJobs,
    layout: '/admin',
  },
  {
    path: '/addjobs',
    name: 'Add Jobs',
    icon: <AddJobsIcon color='inherit' />,
    component: AddJobs,
    layout: '/admin',

  },
  {
    path: '/calendar',
    name: 'Calendar',
    icon: <CalendarIcon color="inherit" />,
    component: Calendar,
    layout: '/admin',
  },
  {
    path: '/setting',
    name: 'Setting',
    icon: <SettingsIcon color='inherit' />,
    component: Setting,
    layout: '/admin',
  },
];
