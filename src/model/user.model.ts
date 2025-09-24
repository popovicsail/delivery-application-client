export interface User {
    id?: number; // ID korisnika (opciono)
    username: string; // Korisničko ime
    password: string; // Lozinka
    role: string; // Uloga korisnika
    reservations?: number[]; // Lista ID-jeva rezervacija (opciono)
}