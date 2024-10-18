import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode'; // Correct import

// Interface for the decoded token
interface DecodedToken {
  id: string;
  email: string;
  role: 'admin' | 'employee';
}

// User interface
interface User {
  id: string;
  email: string;
  role: 'admin' | 'employee';
}

// Auth state interface
export interface AuthState {
  user: User | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
};

// Define the Job and Metadata interfaces
interface Job {
  id: string;
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
  status: string;
  year: string;
  month: string;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login reducer that accepts a token
    login: (state, action: PayloadAction<string>) => {
      const token = action.payload; // Token is passed in via the action payload
      localStorage.setItem('authToken', token); // Save token to localStorage

      try {
        if (token) {
          // Decode the token
          const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
          // Set the user object with decoded data
          state.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
          };
        }
      } catch (error) {
        state.user = null;
        localStorage.removeItem('authToken'); // Clear token from localStorage if invalid
      }
    },
    // Logout reducer
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('authToken'); // Remove token from localStorage
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
