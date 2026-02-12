//Defines interface for an Encounter object

/* Helpful for type checking data from JSON
   files or backend API (if incorportated in future). */

export interface Encounter {
    id: string;
    patientName: string;
    patientId: string;
    date: string;
    type: string;
    status: string;
    provider: string;
    chiefComplaint: string;
    notes: string;
}