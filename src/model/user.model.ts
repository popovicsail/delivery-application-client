export interface User {
    id?: string;
    firstName: string;
    lastName: string;
    profilePictureUrl?: string;
    roles?:string[];
}