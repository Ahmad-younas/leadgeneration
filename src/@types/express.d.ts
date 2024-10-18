import { Request } from "express"; // Define the User interface with the properties you expect

// Define the User interface with the properties you expect
interface User {
  id: string;
  email: string;
  role: string;
}

// Extend the Express Request type to include the user property
export interface CustomRequest extends Request {
  user?: User; // Add your custom user property here
}
