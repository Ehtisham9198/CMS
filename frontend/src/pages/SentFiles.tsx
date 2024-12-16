import React, { useState, useEffect } from "react";

type File = {
  id: string;
  title: string;
};

const ReceivedFiles = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [action, setAction] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [forwardTo, setForwardTo] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    const getFiles = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/get_files", {
          credentials: "include",
        });
        const data = await response.json();

        if (data.fileData && Array.isArray(data.fileData)) {
          setFiles(data.fileData);
        } else {
          setFiles([]);
          console.error("Unexpected data structure:", data);
        }
      } catch (error) {
        console.error("Error fetching files:", error);
        setError("Failed to fetch files. Please try again later.");
      }
    };

    getFiles();
  }, [files]);

  const ForwardFileHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id || !action || !forwardTo) {
      console.error("All fields must be filled");
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
          file_id: id,
          action: action,
          to_users: forwardTo,
        }),
        credentials: "include",
      });
      const data = await response.json();

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
      <h1>Drafted Files</h1>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {files.length > 0 ? (
        <ul>
          {files.map((file) => (
            <li key={file.id}>
              ID: {file.id}, Title: {file.title}
            </li>
          ))}
        </ul>
      ) : (
        <p>No files found.</p>
      )}

      <br />
      <form onSubmit={ForwardFileHandler}>
        <label htmlFor="id">Enter Id</label> <br />
        <input
          type="text"
          name="id"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <br />
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
          <option value="forward">Send</option>
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

export default ReceivedFiles;
