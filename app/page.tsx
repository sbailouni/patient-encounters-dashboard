"use client"; //required to use react hooks (useState) 

import styles from "./page.module.css";
//import interface for type safety
import { Encounter } from "../types/encounter"
import EncounterCard from "@/components/EncounterCard";
import { useState, useRef, useEffect } from "react";
import DropdownIcon from "@/components/DropdownIcon";

export default function Home() {
  //state that tracks which statuses are currently selected in the filter
  // selectedStatuses : array tracking the selected statuses
  // setSelectedStatuses : function that updates state
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const [searchInput, setSearchInput] = useState<string>("");

  // state that tracks whether the dropdown is open or closed 
  // in order to close it when user clicks on anything else
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // state for data coming from the API
  // encounters: array of encounters returned by backend
  // isLoading: tracks whether a request is currently in flight
  // error: holds an error message when the request fails
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch encounters from the API whenever filters
  // (selectedStatuses or searchInput) change
  useEffect(() => {
    // allows to cancel fetch if user updates filters or clicks away
    const controller = new AbortController();

    const fetchEncounters = async () => {
      // set loading state as true and clear any previous error
      setIsLoading(true);
      setError(null);

      try {
        // create query string based on user's selected filters
        // ex: ?status=completed,pending&q=smith
        const params = new URLSearchParams();

        //if any statuses are selected, add them to the query
        if (selectedStatuses.length > 0) {
          params.set("status", selectedStatuses.join(","));
        }

        //if there's a text in search bar, add it to the query
        if (searchInput.trim()) {
          params.set("q", searchInput.trim());
        }
        //convert parameters to string format
        const queryString = params.toString();
        // create final URL for the API endpoint
        const url = queryString
          ? `/api/encounters?${queryString}`
          : "/api/encounters";

        // send request to backend API
        const response = await fetch(url, { signal: controller.signal });

        if (!response.ok) { 
          //throw error if response isn't successful
          throw new Error(`Failed to load encounters (status ${response.status})`);
        }
        
        // convert response to JSON and update state with the encounters
        const body: { encounters: Encounter[] } = await response.json();
        setEncounters(body.encounters);
      } catch (err) {
        //if request was cancelled, don't do anything
        if ((err as Error).name === "AbortError") {
          return;
        }
        console.error(err); 
        // show error message and clear data
        setError("Unable to load encounters. Please try again.");
        setEncounters([]);
      } finally {
        // set loading state to false after
        // all requests (both successful and unsuccessful)
        setIsLoading(false);
      }
    };

    //call function to fetch encounters
    fetchEncounters();

    // cancel request if filters change quickly or user clicks away
    return () => controller.abort();
  }, [selectedStatuses, searchInput]); 

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
          {/* basic loading and error states */}
          {isLoading && (
            <p>Loading encounters...</p>
          )}

          {/* show error message if there's an error and we're not loading anymore */}
          {error && !isLoading && (
            <p>{error}</p>
          )}

          {/* show a message when there are no results */}
          {!isLoading && !error && encounters.length === 0 && (
            <p>No encounters match your filters.</p>
          )}

          {/* render one card per encounter if data loaded with no error */}
          {!isLoading && !error && encounters.map((encounter) => (
            <EncounterCard key={encounter.id} encounter={encounter} />
          ))}
        </div>
      </main>
    </div>
  );
}
