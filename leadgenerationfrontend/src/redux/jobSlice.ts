// src/redux/jobSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Job {
  id:string;
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  contactNumber: string;
  address: string;
  postcode: string;
  landlordName: string;
  landlordContactNumber: string;
  landlordEmail: string;
  agentName: string;
  agentContactNumber: string;
  agentEmail: string;
  heatingType: string;
  propertyType: string;
  epcRating: string;
  serviceType: string;
  assessmentDate: string;
  notes: string;
  status:string;
  year:string;
  month:string;
}


// Define the state shape for jobs
export interface JobState {
  jobs: Job[];
}

// Initial state
const initialState: JobState = {
  jobs: [],
};

// Create the slice
const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJob: (state, action: PayloadAction<Job[]>) => {
      state.jobs = action.payload;
    },
  },
});

export const { setJob } = jobSlice.actions;
export default jobSlice.reducer;
