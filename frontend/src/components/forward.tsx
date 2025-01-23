import { SERVER_URL } from "@/hooks/requests";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

type File = {
  id: string;
  title: string;
  content: string;
};

const CreatedFiles = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [id, setId] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [forwardTo, setForwardTo] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fileIdFromUrl = searchParams.get("file_id");
    if (fileIdFromUrl) {
      setId(fileIdFromUrl);
    } else {
      setError("File ID is required to fetch the details.");
    }
  }, [searchParams]);

  useEffect(() => {
    const getFiles = async () => {
      if (!id) return;

      try {
        const response = await fetch( SERVER_URL + `/api/fileById?file_id=${id}`, {
          credentials: "include",
        });
        const data = await response.json();

        if (data.fileData) {
          setFiles(data.fileData);
        } else {
          setFiles([]);
        }
      } catch (error) {
        console.error("Error fetching files:", error);
        setError("Failed to fetch files. Please try again later.");
      }
    };

    getFiles();
  }, [id]);

  const ForwardFileHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id || !forwardTo) {
      setError("All fields must be filled before forwarding.");
      return;
    }

    try {
      const response = await fetch(SERVER_URL + "/api/file_forward", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file_id: id,
          action: "Send",
          to_users: forwardTo,
          remarks: remarks,
        }),
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        setError(null);
        setSuccessMessage("File forwarded successfully!");
        setTimeout(() => {
            navigate("/files");
          }, 1000);
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
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Files Details</h1>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      {successMessage && <div className="text-green-500 text-center mb-4">{successMessage}</div>}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        {files.length > 0 ? (
          <div className="space-y-6">
            {files.map((file) => (
              <div key={file.id} className="p-4 border rounded-md shadow-sm bg-gray-50">
                <div className="text-sm font-medium text-gray-700">
                  <span className="font-semibold">ID:</span> {file.id}
                </div>
                <div className="text-sm font-medium text-gray-700">
                  <span className="font-semibold">Title:</span> {file.title}
                </div>
                <div className="text-sm font-medium text-gray-700">
                  <span className="font-semibold">Content:</span> {file.content}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">No files found.</p>
        )}
      </div>


      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={ForwardFileHandler}>
          <div className="mb-6">
            <label htmlFor="remarks" className="block text-gray-700 font-semibold mb-2">
              Remarks
            </label>
            <input
              type="text"
              name="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="forward" className="block text-gray-700 font-semibold mb-2">
              Forward To
            </label>
            <select
              name="forward"
              id="forward"
              className="w-full p-2 border rounded-lg"
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
              <option value="Convenor PEC">Convenor PEC</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Forward
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatedFiles;
