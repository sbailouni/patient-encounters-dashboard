"use client"; //required to use react hooks (useState) 

import styles from "./page.module.css";
//import mock data from JSON file
import data from "../data/encounters.json"
//import interface for type safety
import { Encounter } from "../types/encounter"
import EncounterCard from "@/components/EncounterCard";
import { useState, useRef, useEffect } from "react";
import DropdownIcon from "@/components/DropdownIcon";

//define array of encounters with type Encounter[]
const encounters: Encounter[] = data.encounters; 

export default function Home() {
  //state that tracks which statuses are currently selected in the filter
  // selectedStatuses : array tracking the selected statuses
  // setSelectedStatuses : function that updates state
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const [searchInput, setSearchInput] = useState<string>("");

  // state that tracks whether the dropdown is open or closed 
  // in order to close it when user clicks on anything else
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // create a ref to the <details> element so we can detect clicks
  // outside the dropdown
  const dropdownRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    // function that detects clicks outside the dropdown
    const handleClickOutside = (event: MouseEvent) => {
      // if the dropdown ref exists (dropdown was opened)
      // and clicked element is not inside the dropdown 
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        // close the dropdown by setting state to false
        setIsDropdownOpen(false);
      }
    };
    // add event listener to detect clicks outside the dropdown
    document.addEventListener("mousedown", handleClickOutside);
    // remove event listener when user closes the dropdown
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      //if no statuses are selected, show all encounters (first case)
      //if there are statuses selected, show only encounters with those statuses
      const passesStatusFilter = 
        selectedStatuses.length=== 0 || selectedStatuses.includes(encounter.status);

      //checks whether patient name contains the typed input
      const passesSearchFilter = 
        encounter.patientName.toLowerCase().includes(searchInput.toLowerCase());

      //return encounters that match selected statuses *and* patient name input
      return passesStatusFilter && passesSearchFilter; 
    }
  );

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.heading}>Patient Encounters Dashboard</h1>
        <div className={styles.flexContainer}>
          {/* Patient name search bar */}
          <input
            type="text"
            placeholder="Search by patient name..."
            value={searchInput}
            //updates searchInput state whenever user types
            onChange={(e)=> setSearchInput(e.target.value)}
            className= {styles.searchBar}
          />
          {/* Dropdown status filter */}
          <details
            className={styles.dropdown}
            ref={dropdownRef} //ref to the <details> element
            open={isDropdownOpen} //tracks whether the dropdown is open or closed
          >
            <summary 
              className={styles.dropdownSummary} 
              onClick={(e) => { 
                //prevent the default behavior of the click
                e.preventDefault();
                // toggle dropdown by setting state to opposite of the current state
                // opened -> closed, closed -> opened
                setIsDropdownOpen((prev) => !prev);
              }}
            >
              Filter by Status 
              <span className={styles.chevron} aria-hidden><DropdownIcon/></span>
            </summary>
            <div className={styles.dropdownPanel}>
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
        </div>

        <div className={styles.cardList} role="list" aria-label="Patient encounters">
          {/* iterate over the filtered encounters and render
            one EncounterCard component per encounter */}
          {filteredEncounters.map((encounter) => (
            <EncounterCard key={encounter.id} encounter={encounter} />
          ))}
        </div>
      </main>
    </div>
  );
}
