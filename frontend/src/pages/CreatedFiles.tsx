import { Forward } from "lucide-react";
import React, { useState, useEffect } from "react";

type File = {
  id: string;
  title: string;
};

const CreatedFiles = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [action, setAction] = useState<string>("");
  const [forwardTo, setForwardTo] = useState<string>("");

  console.log({files, action, forwardTo});

  useEffect(() => {
    const getFiles = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/get_files", {
          credentials: "include",
        });
        const data = await response.json();
        console.log(data);
        setFiles(data.fileData);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    getFiles();
  }, []);

  const ForwardFileHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/file_actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: action,
          to_users: forwardTo,
        }),
        credentials: "include",
      });

      const data = await response.json();
    } catch (error) {
      console.error("Error forwarding file:", error);
    }
  };

  return (
    <div>
      <h1>Created Files</h1>
      <ul>
        {files.map((file) => (
          <li key={file.id}>
            ID: {file.id}, Title: {file.title}
          </li>
        ))}
      </ul>

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
          <option value="forward">Select Option</option>
          <option value="forward">forward</option>
          <option value="reject">Reject</option>
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
          <option value="Dean A">Select Reciever</option>
          <option value="Dean A">Dean A</option>
          <option value="Dean SA">Dean SA</option>
          <option value="HoD CSE">HoD CSE</option>
          <option value="HoD ETC">HoD ETC</option>
          <option value="HoD EEE">HoD EEE</option>
          <option value="Registrar">Registrar</option>
          <option value="Director">Director</option>
        </select>

        <br />
        <br />
        <button className="px-2 py-1 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
          Forward
        </button>
      </form>
    </div>
  );
};

export default CreatedFiles;
