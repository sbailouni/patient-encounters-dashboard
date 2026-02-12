//Component that renders a row <tr> that represents one patient encounter
import {Encounter} from "../types/encounter"
import StatusLabel from "../components/StatusLabel";

// Defining props expected by the component using an interface
interface EncounterRowProps {
    encounter: Encounter; //receives one encounter object of type Encounter
}

export default function EncounterRow({ encounter }: EncounterRowProps) {
    return (
        //table row will be placed inside <tbody> in page.tsx
        <tr>
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
