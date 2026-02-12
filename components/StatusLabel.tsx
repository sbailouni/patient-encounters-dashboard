//Component that helps render a styled span element for the status label
//It selects a color based on the status type

// Defining props expected by the component using an interface
interface StatusLabelProps {
    status: string; //receives a string representing the status
}

//map encounter statuses to background colors
const colors: Record<string, string> = {
    cancelled: "#fcccbcff", //red
    completed: "#c9ffbbff", //green
    pending: "#fcfcc1ff" //yellow
};

export default function StatusLabel({status}: StatusLabelProps) {
    //default to a white background if the status isn't found in the object
    const color = colors[status.toLowerCase()] || "#ffffff";
    return (
        <span
            style={{
                backgroundColor: color,
                padding: "4px 12px",
                borderRadius: "40px",
                fontSize: "0.85rem",
                fontWeight: 450,
            }}
        >
            {status}
        </span>
    );
}