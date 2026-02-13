// Async page component that showcases encounter details
import styles from "../../../app/page.module.css";
import data from "../../../data/encounters.json";
import {Encounter} from "../../../types/encounter";
import StatusLabel from "@/components/StatusLabel";
import BackArrowIcon from "@/components/BackArrowIcon";
import Link from "next/link"; //link component for navigation between pages

//Define props for the component
interface EncounterDetailProps {
    params: Promise<{ id: string }>; //params is a promise in Next.js 15 app router
}

export default async function EncounterDetail ({params}: EncounterDetailProps ) {
    const { id } = await params; //function needs to await params since it's a promise object
    
    //find the encounter in mock data with the matching id 
    const encounter: Encounter | undefined = data.encounters.find((e) => e.id === id);
    
    if (!encounter) { //when encounter can't be found or is undefined
        return (
            //return a <div> element showing a not found message
            <div className={styles.page}> 
                <main className={styles.mainCompact}>
                    <Link href="/" className={styles.backLink} aria-label="Back to dashboard"><BackArrowIcon /></Link>
                    <div className={styles.detailCard}>
                        <h2 className={styles.heading}>Encounter not found.</h2>
                    </div>
                </main>
            </div>
        );
    }
    return (
        <div className={styles.page}>
            <main className={styles.mainCompact}>
                <Link href="/" className={styles.backLink} aria-label="Back to dashboard"><BackArrowIcon /></Link>
                <div className={styles.detailCard}>
                    <h1 className={styles.heading}>Encounter Details</h1>
                    <p><strong>Encounter Id:</strong> {encounter.id}</p>
                    <p><strong>Date:</strong> {new Date(encounter.date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {new Date(encounter.date).toLocaleTimeString('en-US', {timeZone: "UTC", hour: '2-digit', minute: '2-digit'})}</p>
                    <p><strong>Patient:</strong> {encounter.patientName}</p>
                    <p><strong>Patient Id:</strong> {encounter.patientId}</p>
                    <p><strong>Status:</strong> <StatusLabel status={encounter.status} /></p>
                    <p><strong>Type:</strong> {encounter.type}</p>
                    <p><strong>Provider:</strong> {encounter.provider}</p>
                    <p><strong>Chief Complaint:</strong> {encounter.chiefComplaint}</p>
                    <h3>Clinical notes:</h3>
                    <p>{encounter.notes || "No notes available."}</p>
                </div>
            </main>
            
        </div>
    );
}