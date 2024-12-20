import React, { useState} from "react";
import { useLocation } from "react-router-dom";

interface LocationState {
    id: string;
  }


const Action = () => {
  const [action, setAction] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [forwardTo, setForwardTo] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [remarks, setRemarks] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const location = useLocation();
  const state = location.state as LocationState; 
  const fileId = state?.id;


  const ForwardFileHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fileId || !action || (!forwardTo && action === "forward")) {
      console.log("All fields must be filled", fileId, action, forwardTo);
      setError("All fields must be filled before forwarding.");
      return;
    }
    
    try {
      const response = await fetch("http://localhost:3000/api/file_forward", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file_id: fileId,
          action: action,
          to_users: forwardTo,
          remarks: remarks,
        }),
        credentials: "include",
      });
      const data = await response.json();
      console.log(data,"error")

      if (response.ok) {
        setError(null); 
        setSuccessMessage("File forwarded successfully!");
      } else {
        setError(data.error || "Failed to forward file.");
        setSuccessMessage("");
      }
    } catch (error) {
      setError("Error forwarding file. Please try again later.");
      setSuccessMessage("");
    }
  };

  return (
    <div>
       <br />
        <label htmlFor="remarks">Remarks</label> <br />
        <input
          type="text"
          name="remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
        <br />
      <form onSubmit={ForwardFileHandler}>       
        <label htmlFor="action">Action</label>
        <br />
        <select
          name="action"
          id="action"
          className="border p-2"
          value={action}
          onChange={(e) => setAction(e.target.value)}
        >
          <option value="">Select Option</option>
          <option value="forward">Forward</option>
          <option value="reject">Reject</option>
          <option value="complete">Complete</option>
        </select>

        <br />
        <label htmlFor="forward">Forward to</label>
        <br />
        <select
          name="forward"
          id="forward"
          className="border p-2"
          value={forwardTo}
          onChange={(e) => setForwardTo(e.target.value)}
        >
          <option value="">Select Receiver</option>
          <option value="Dean A">Dean A</option>
          <option value="Dean SA">Dean SA</option>
          <option value="HoD CSE">HoD CSE</option>
          <option value="HoD ETC">HoD ETC</option>
          <option value="HoD EEE">HoD EEE</option>
          <option value="Registrar">Registrar</option>
          <option value="Director">Director</option>
          <option value="Director">Convenor PEC</option>

        </select>

        <br />
        <br />
        <button
          className="px-2 py-1 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Forward
        </button>
        <div className="popup success">
          <p>{successMessage}</p>
        </div>
      </form>
    </div>
  );
};

export default Action;
