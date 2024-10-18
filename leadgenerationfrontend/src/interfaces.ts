import React from 'react';
import { FlexProps } from '@chakra-ui/react';
export interface Route {
  path: string;
  name: string;
  icon?: React.ReactNode;
  component: React.FC;
  layout: string;
  redirect?: boolean;
  category?: boolean;
  views?: Route[];
  state?: string;
}
export interface SidebarProps {
  logoText: String;
  routes?: Route[];
  display: String;
  sidebarVariant: 'opaque' | 'transparent';
}

export interface NavbarLinkProps {
  brandText: string;
  brandTextS: string;
}

export interface EmployeeNavbarLinkProps {
  brandText: string;
  brandTextS: string;
  mainTextColor: string;
  secondaryTextColor: string;
  navbarIconColor: string;
  backgroundColor: string;
}

export interface SideBarProps {
  sidebarVariant: 'opaque' | 'transparent';
}

export interface SeparatorProps extends FlexProps {
  variant?: string;
  children?: React.ReactNode;
}
export interface MiniStatisticsProps {
  title: string;
  amount: string | number;
  percentage: number;
  icon: React.ReactNode;
}
export interface DecodeToken {
  id: string;
  role: 'admin' | 'employee';
  email:string
}
