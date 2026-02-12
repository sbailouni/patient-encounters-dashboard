import styles from "./page.module.css";
//import mock data from JSON file
import data from "../data/encounters.json"
//import interface for type safety
import { Encounter } from "../types/encounter"

//define array of encounters with type Encounter[]
const encounters: Encounter[] = data.encounters; 

export default function Home() {
  return (
    <div className={styles.page}>
      <h1>Patient Encounters Dashboard</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Status</th>
            <th>Type</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {/* For each encounter in the encounters array,
          render a <tr> with its info */}
          {encounters.map((encounter) => (
            <tr key={encounter.id}>
              <td>{encounter.patientName}</td>
              <td>{encounter.status}</td>
              <td>{encounter.type}</td>
              {/* Convert date to string */}
              <td>{new Date(encounter.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
