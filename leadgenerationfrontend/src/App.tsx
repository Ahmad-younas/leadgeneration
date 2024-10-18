import './App.css';
import { SignIn } from './Auth/SignIn';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RootState } from './redux/store';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './fontAwesome';
import { AdminDashboard } from './Admin/AdminDashboard';
import { NotFound } from './Components/NotFound';
import { ForgotPassword } from './Components/ForgotPassword';
import { RecoverPassword } from './Components/RecoverPassword';
import { EmployeeDashboard } from './Employee/EmployeeDashboard';
import { useSelector } from 'react-redux';
import React from 'react';
import "react-big-calendar/lib/css/react-big-calendar.css";
import Callback from './Auth/Callback';
import SpreadSheetIntegration from './Auth/SpreadSheetIntegration';
import { DropboxCallback } from './Auth/DropboxCallback';

interface PrivateRoutePage {
  component: React.FC;
  roles: ('admin' | 'employee')[];
  exact?: boolean;
}

const PrivateRoutes: React.FC<PrivateRoutePage> = ({
  component: Component,
  roles,
  ...rest
}) => {
  const user  = useSelector((state: RootState)=> state.auth.user);
  if (!user) {
    return <Navigate to="/" />;
  }
  if (!roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return <Component />;
};
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route
            path={'/admin*'}
            element={
              <PrivateRoutes
                roles={['admin']}
                exact={true}
                component={AdminDashboard as any}
              />
            }
          />
          <Route
            path={'/employee*'}
            element={
              <PrivateRoutes
                roles={['employee']}
                exact={true}
                component={EmployeeDashboard as any}
              />
            }
          />
          {/*<Route*/}
          {/*  path="/admin/*"*/}
          {/*  element={<AdminDashboard sidebarVariant={'opaque'} />}*/}
          {/*/>*/}
          {/*<Route*/}
          {/*  path="/employee/*"*/}
          {/*  element={<EmployeeDashboard sidebarVariant={'opaque'} />}*/}
          {/*/>*/}

          <Route path="/auth/callback" element={<Callback/>}/>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/spreadSheet" element={<SpreadSheetIntegration />} />
          <Route path="/dropbox/callback" element={<DropboxCallback/>} />
          <Route path="/recover-password" element={<RecoverPassword />} />
          <Route path={'/404page'} element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404page" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
