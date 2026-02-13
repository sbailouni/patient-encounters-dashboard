//Component that renders a clickable card (<article>) that represents one patient encounter

"use client"; //required when using event handlers (like onClick)

import { Encounter } from "../types/encounter";
import StatusLabel from "./StatusLabel";
import { useRouter } from "next/navigation";
import styles from "./EncounterCard.module.css";

// Defining props expected by the component using an interface
interface EncounterCardProps {
  encounter: Encounter; //receives one encounter object of type Encounter
}

export default function EncounterCard({ encounter }: EncounterCardProps) {
  //define router variable to use the useRouter hook
  const router = useRouter();

  //navigates to the encounter detail page (/encounter/[id]) on click 
  const handleClick = () => {
    router.push(`/encounter/${encounter.id}`);
  };

  return (
    <article
      onClick={handleClick} //trigger navigation to details page on click
      role="button" //article behaves like a button
      className={styles.card}
      aria-label={`View details for ${encounter.patientName}`}
    >
      {/* Patient name row */}
      <div className={`${styles.cardRow} ${styles.cardPatient}`}>
        <span className={styles.cardLabel}>Patient</span>
        <span className={styles.cardValue}>{encounter.patientName}</span>
      </div>
      {/* Encounter status row */}
      <div className={styles.cardRow}>
        <span className={styles.cardLabel}>Status</span>
        <StatusLabel status={encounter.status} />
      </div>
      {/* Encounter type row */}
      <div className={styles.cardRow}>
        <span className={styles.cardLabel}>Type</span>
        <span className={styles.cardValue}>{encounter.type}</span>
      </div>
      {/* Encounter date row */}
      <div className={styles.cardRow}>
        <span className={styles.cardLabel}>Date</span>
        <span className={styles.cardValue}>
          {/* Convert date to string */}
          {new Date(encounter.date).toLocaleDateString()}
        </span>
      </div>
    </article>
  );
}
