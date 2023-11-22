import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import LockClosedIcon from '@heroicons/react/24/solid/LockClosedIcon';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import UserPlusIcon from '@heroicons/react/24/solid/UserPlusIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';

import CloudIcon from '@heroicons/react/24/solid/CloudIcon';
import CloudArrowUpIcon from '@heroicons/react/24/solid/CloudArrowUpIcon';
import IotIcon from '@heroicons/react/24/solid/CpuChipIcon';
import BellIcon from '@heroicons/react/24/solid/BellAlertIcon';
import SunIcon from '@heroicons/react/24/solid/SunIcon';
import { SvgIcon } from '@mui/material';

export const items = [
  {
    title: 'DashBoard',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Cloud',
    path: '/cloud',
    icon: (
      <SvgIcon fontSize="small">
        <CloudIcon />
      </SvgIcon>
    )
  },
  {
    title: 'CloudCheck',
    path: '/cloud-check',
    icon: (
      <SvgIcon fontSize="small">
        <CloudArrowUpIcon />
      </SvgIcon>
    )
  },
  {
    title: 'IoT',
    path: '/iot',
    icon: (
      <SvgIcon fontSize="small">
        <IotIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Reserve',
    path: '/reserve',
    icon: (
      <SvgIcon fontSize="small">
        <BellIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Weather',
    path: '/weather',
    icon: (
      <SvgIcon fontSize="small">
        <SunIcon />
      </SvgIcon>
    )
  },
  // {
  //   title: 'Customers',
  //   path: '/customers',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <UsersIcon />
  //     </SvgIcon>
  //   )
  // },
  // {
  //   title: 'Companies',
  //   path: '/companies',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <ShoppingBagIcon />
  //     </SvgIcon>
  //   )
  // },
  // {
  //   title: 'Account',
  //   path: '/account',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <UserIcon />
  //     </SvgIcon>
  //   )
  // },
  // {
  //   title: 'Settings',
  //   path: '/settings',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <CogIcon />
  //     </SvgIcon>
  //   )
  // },
  // {
  //   title: 'Login',
  //   path: '/auth/login',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <LockClosedIcon />
  //     </SvgIcon>
  //   )
  // },
  // {
  //   title: 'Register',
  //   path: '/auth/register',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <UserPlusIcon />
  //     </SvgIcon>
  //   )
  // },
  // {
  //   title: 'Error',
  //   path: '/404',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <XCircleIcon />
  //     </SvgIcon>
  //   )
  // }
];
