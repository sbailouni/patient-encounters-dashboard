"use client"; //required to use react hooks (useState) 

import styles from "./page.module.css";
//import mock data from JSON file
import data from "../data/encounters.json"
//import interface for type safety
import { Encounter } from "../types/encounter"
import EncounterRow from "@/components/EncounterRow";
import {useState} from "react";

//define array of encounters with type Encounter[]
const encounters: Encounter[] = data.encounters; 

export default function Home() {
  //state that tracks which statuses are currently selected in the filter
  // selectedStatuses : array tracking the selected statuses
  // setSelectedStatuses : function that updates state
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  //function that adds or removes a status from the selectedStatuses
  //triggered when a change happens to a checkbox
  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev)  => {
      //if status is already selected in the previous state then remove it
      if (prev.includes(status)) {
        return prev.filter((s) => s !== status);
      }
      else {
        //if status doesn't exist, add it 
        return [...prev, status] //copies old array and adds one more item
      }
    }); 
  };

  //filter the encounters based on selected statuses
  const filteredEncounters: Encounter[] = data.encounters.filter(
    (encounter) => {
      //if no statuses are selected, show all encounters (default case)
      if (selectedStatuses.length=== 0) { 
        return true;
      }
      // if there are statuses selected,
      // show only encounters with those selected statuses
      return selectedStatuses.includes(encounter.status);
    }
  );

  return (
    <div className={styles.page}>
      <h1>Patient Encounters Dashboard</h1>
      {/* Dropdown status filter */}
      <details className={styles.dropdown}>
        <summary>
          Filter by Status
        </summary>
        <div>
          {/* Generate a check box for each status*/}
          {["completed", "pending", "cancelled"].map((status) => (
              <label
                key={status}
              >
                <input
                  type="checkbox"
                  //checkbox is checked when status is included in selectedStatuses
                  checked={selectedStatuses.includes(status)} 
                  //toggle status when checkbox is clicked
                  onChange={() => toggleStatus(status)}
                />
                {" "}{status}
              </label>
            ))}
        </div>
      </details>

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
          {filteredEncounters.map((encounter) => (
            <EncounterRow
              key={encounter.id}
              encounter={encounter}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
