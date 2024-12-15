import React, { useEffect,useState } from "react";
import { useSession } from "../context/Session";

function Dashboard() {
  const session = useSession();
  const [files, setFiles] = useState<File[]>([]);

  type File = {
    id: string;
    title: string;
    from_user: string;
    action: string;
    remarks: string;
  };

 useEffect(() => {
    const getFiles = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/recievedFile", {
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

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
      <h1>Received Files</h1>
      <ul>
        {files.map((file) => (
          <li key={file.id}>
            ID: {file.id}, Title: {file.title}, Sender: {file.from_user},action by sender : {file.action}, Remarks :{file.remarks}
          </li>
        ))}
      </ul>

      <br />
    </div>
    </div>
  );
}

export default Dashboard;
