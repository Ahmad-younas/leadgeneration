// export const ENDPOINTS = {
//   addEmployee:
//     process.env.NODE_ENV === 'development'
//       ? 'http://localhost:3002/api/add-employee'
//       : '/api/add-employee',
//   getAllJobs:
//     process.env.NODE_ENV === 'development'
//       ? 'http://localhost:3002/api/all-jobs'
//       : '/api/all-jobs',
//   deleteSelectedJob:
//     process.env.REACT_APP_NODE_ENV === 'development'
//       ? 'http://localhost:3002/api/deleteSelectedJobs'
//       : '/api/deleteSelectedJobs',
//   deleteAllJobs:
//     process.env.REACT_APP_NODE_ENV === 'development'
//       ? 'http://localhost:3002/api/deleteAllJobs'
//       : '/api/deleteAllJobs',
//   getEmployeeInfoAndEmployeeJobInfo:
//     process.env.REACT_APP_NODE_ENV === 'development'
//       ? 'http://localhost:3002/api/get-Employee-Info-And-Employee-Job-Info'
//       : '/api/get-Employee-Info-And-Employee-Job-Info',
//   createDropBoxLink:
//     process.env.REACT_APP_NODE_ENV === 'development'
//       ? `http://localhost:3002/api/createFolderInDropBox/`
//       : `/api/createFolderInDropBox/`,
//   updateEmployeeJob:
//     process.env.REACT_APP_NODE_ENV === 'development'
//       ? 'http://localhost:3002/api/updateEmployeeJob'
//       : '/api/updateEmployeeJob',
//   deleteSelectedEmployees:
//     process.env.REACT_APP_NODE_ENV === 'development'
//       ? 'http://localhost:3002/api/deleteSelectedEmployees'
//       : '/api/deleteSelectedEmployees',
//   allEmployee:
//     process.env.REACT_APP_NODE_ENV === 'development'
//       ? 'http://localhost:3002/api/all-employee/'
//       : '/api/all-employee/',
//   getMonthlyCountJob:
//     process.env.REACT_APP_NODE_ENV === 'development'
//       ? 'http://localhost:3002/api/get-monthly-count-job'
//       : '/api/get-monthly-count-job',
//   updateEmployee:
//     process.env.REACT_APP_NODE_ENV === 'development'
//       ? 'http://localhost:3002/api/updateEmployee'
//       : '/api/updateEmployee',
//   getAllJobStatus:
//     process.env.REACT_APP_NODE_ENV === 'development'
//       ? 'http://localhost:3002/api/getAllJobStatus'
//       : '/api/getAllJobStatus',
//   getEmployeeJobInfo:
//     process.env.REACT_APP_NODE_ENV === 'development'
//       ? 'http://localhost:3002/api/getEmployeeJobInfo/'
//       : '/api/getEmployeeJobInfo/',
//   authWithDropBox:
//     process.env.REACT_APP_NODE_ENV === 'development'
//       ? 'http://localhost:3002/api/authWithDropBox'
//       : '/api/authWithDropBox',
//   dropBoxAuthURL:
//     process.env.REACT_APP_NODE_ENV === 'development'
//       ? 'http://localhost:3002/api/dropbox/auth-url'
//       : '/api/dropbox/auth-url',
//   getStatusCountOfJob:
//     process.env.REACT_APP_NODE_ENV === 'development'
//       ? 'http://localhost:3002/api/getStatusCountOfJobs'
//       : '/api/getStatusCountOfJobs',
//   authCallback:
//     process.env.REACT_APP_NODE_ENV === 'development'
//       ? 'http://localhost:3002/api/auth/callback'
//       : '/auth/callback',
//   dropboxCallback:
//     process.env.REACT_APP_NODE_ENV === 'development'
//       ? 'http://localhost:3002/api/dropbox/callback'
//       : '/dropbox/callback',
//   login:
//     process.env.REACT_APP_NODE_ENV === 'development'
//       ? 'http://localhost:3002/api/login'
//       : '/api/login',
//   authGoogle:
//     process.env.REACT_APP_NODE_ENV === 'development'
//       ? 'http://localhost:3002/api/auth/google'
//       : '/auth/google',
//   getEmployeeById:
//     process.env.REACT_APP_NODE_ENV === 'development'
//       ? 'http://localhost:3002/api/getEmployeeById'
//       : '/api/getEmployeeById',
//   updateAdmin:
//     process.env.REACT_APP_NODE_ENV === 'development'
//       ? 'http://localhost:3002/api/update-admin'
//       : '/api/update-admin',
//   getEmployeeWithJobInfo:
//     process.env.REACT_APP_NODE_ENV === 'development'
//       ? 'http://localhost:3002/api/getEmployeeWithJobInfo'
//       : '/api/getEmployeeWithJobInfo',
//   forgotPassword:
//     process.env.REACT_APP_NODE_ENV === 'development'
//       ? 'http://localhost:3002/api/forgetPassword'
//       : '/api/forgetPassword',
//   resetPassword:
//     process.env.REACT_APP_NODE_ENV === 'development'
//       ? 'http://localhost:3002/api/resetPassword'
//       : '/api/resetPassword',
//   addJob:
//     process.env.REACT_APP_NODE_ENV === 'development'
//       ? 'http://localhost:3002/api/add-job'
//       : '/api/add-job',
//   getJobInfoOfEmployee:
//     process.env.REACT_APP_NODE_ENV === 'development'
//       ? 'http://localhost:3002/api/getJobInfoOfEmployee/'
//       : '/api/getJobInfoOfEmployee/',
//   getIndividualEmployeeWithJobInfo:
//     process.env.REACT_APP_NODE_ENV === 'development'
//       ? 'http://localhost:3002/api/getIndividualEmployeeWithJobInfo'
//       : '/api/getIndividualEmployeeWithJobInfo',
//   getJobInfoOfEmployeeWithPagination:
//     process.env.REACT_APP_NODE_ENV === 'development'
//       ? 'http://localhost:3002/api/getJobInfoOfEmployeeWithPagination'
//       : '/api/getJobInfoOfEmployeeWithPagination',
//   getJobStatusById:
//     process.env.REACT_APP_NODE_ENV === 'development'
//       ? 'http://localhost:3002/api/getJobStatusById'
//       : '/api/getJobStatusById',
//   getEmployeeJobs:
//     process.env.REACT_APP_NODE_ENV === 'development'
//       ? 'http://localhost:3002/api/getEmployeeJobs'
//       : '/api/getEmployeeJobs',
//   getMonthlyJobCountOfEmployee:
//     process.env.REACT_APP_NODE_ENV === 'development'
//       ? 'http://localhost:3002/api/getMonthlyJobCountOfEmployee'
//       : '/api/getMonthlyJobCountOfEmployee',
// };

export const ENDPOINTS = {
  addEmployee: getApiUrl('/api/add-employee'),
  getAllJobs: getApiUrl('/api/all-jobs'),
  deleteSelectedJob: getApiUrl('/api/deleteSelectedJobs'),
  deleteAllJobs: getApiUrl('/api/deleteAllJobs'),
  getEmployeeInfoAndEmployeeJobInfo: getApiUrl(
    '/api/get-Employee-Info-And-Employee-Job-Info'
  ),
  createDropBoxLink: getApiUrl('/api/createFolderInDropBox/'),
  updateEmployeeJob: getApiUrl('/api/updateEmployeeJob'),
  deleteSelectedEmployees: getApiUrl('/api/deleteSelectedEmployees'),
  allEmployee: getApiUrl('/api/all-employee/'),
  getMonthlyCountJob: getApiUrl('/api/get-monthly-count-job'),
  updateEmployee: getApiUrl('/api/updateEmployee'),
  getAllJobStatus: getApiUrl('/api/getAllJobStatus'),
  getEmployeeJobInfo: getApiUrl('/api/getEmployeeJobInfo/'),
  authWithDropBox: getApiUrl('/api/authWithDropBox'),
  dropBoxAuthURL: getApiUrl('/api/dropbox/auth-url'),
  getStatusCountOfJob: getApiUrl('/api/getStatusCountOfJobs'),
  authCallback: getApiUrl('/api/auth/callback'),
  dropboxCallback: getApiUrl('/api/dropbox/callback'),
  login: getApiUrl('/api/login'),
  authGoogle: getApiUrl('/api/auth/google'),
  getEmployeeById: getApiUrl('/api/getEmployeeById'),
  updateAdmin: getApiUrl('/api/update-admin'),
  getEmployeeWithJobInfo: getApiUrl('/api/getEmployeeWithJobInfo'),
  forgotPassword: getApiUrl('/api/forgetPassword'),
  resetPassword: getApiUrl('/api/resetPassword'),
  addJob: getApiUrl('/api/add-job'),
  getJobInfoOfEmployee: getApiUrl('/api/getJobInfoOfEmployee/'),
  getIndividualEmployeeWithJobInfo: getApiUrl(
    '/api/getIndividualEmployeeWithJobInfo'
  ),
  getJobInfoOfEmployeeWithPagination: getApiUrl(
    '/api/getJobInfoOfEmployeeWithPagination'
  ),
  getJobStatusById: getApiUrl('/api/getJobStatusById'),
  getEmployeeJobs: getApiUrl('/api/getEmployeeJobs'),
  getMonthlyJobCountOfEmployee: getApiUrl('/api/getMonthlyJobCountOfEmployee'),
};

function getApiUrl(endpoint: string) {
  return process.env.NODE_ENV === 'development'
    ? `http://localhost:3002${endpoint}`
    : endpoint;
}
