import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import { IoEllipsisVertical } from "react-icons/io5";
import { Link } from "react-router-dom";
import { IFile } from "./Dashboard";

function CreateFile() {
  const [files, setFiles] = useState<IFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFiles = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/get_files", {
          credentials: "include",
        });
        const data = await response.json();

        console.log("my initiated files", data);

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
  }, []);

  return (
    <div className="sm:p-4 space-y-2">
      <Button asChild>
        <Link to="/files/create">Create new</Link>
      </Button>

      <div className="shadow">
        <Table className="bg-white">
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>File ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Created on</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.id}>
                <TableCell>{file.id}</TableCell>
                <TableCell className="line-clamp-1 h-9">{file.title}</TableCell>
                <TableCell className="w-full">{file.content}</TableCell>
                <TableCell>{file.created_at}</TableCell>
                <TableCell>
                  <IoEllipsisVertical />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default CreateFile;
