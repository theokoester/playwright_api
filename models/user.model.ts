import { Location } from "./location.model";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string;
    email: string
    location?: Location
}