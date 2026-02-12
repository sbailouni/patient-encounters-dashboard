"use client"; //required when using event handlers (like onClick)

//Component that renders a row <tr> that represents one patient encounter
import {Encounter} from "../types/encounter"
import StatusLabel from "../components/StatusLabel";
import { useRouter } from "next/navigation";

// Defining props expected by the component using an interface
interface EncounterRowProps {
    encounter: Encounter; //receives one encounter object of type Encounter
}

export default function EncounterRow({ encounter }: EncounterRowProps) {
    //define router variable to use the useRouter hook
    const router = useRouter();

    //navigates to the encounter detail page (/encounter/[id]) on click 
    const handleClick = () => {
        router.push(`/encounter/${encounter.id}`);
    };

    return (
        //table row will be placed inside <tbody> in page.tsx
        <tr
            onClick= {handleClick}
            style= {{cursor: "pointer"}}
        >
            <td>{encounter.patientName}</td>
            <td>
                <StatusLabel status={encounter.status} />
            </td>
            <td>{encounter.type}</td>
            {/* Convert date to string */}
            <td>{new Date(encounter.date).toLocaleDateString()}</td>
        </tr>
    );
}
