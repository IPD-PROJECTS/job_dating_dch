import { ResidenceChoice } from "../app.component";

export interface RegisteredUser {
  lastname: string;
  firstname: string;
  email: string;
  phoneNumber: string;
  residence: ResidenceChoice;
  cvFile?: string
}
