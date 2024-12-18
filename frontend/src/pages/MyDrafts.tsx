import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IoEllipsisVertical } from "react-icons/io5";
import { Link } from "react-router-dom";
import { IFile } from "./Dashboard";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

function MyDrafts() {
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
      <br />
      <br />
      <h1>Created Files</h1>

      <div className="shadow">
        <Table className="bg-white">
          <TableHeader>
            <TableRow>
              <TableHead className="text-nowrap">File ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Content</TableHead>
              <TableHead className="text-nowrap">Created on</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.id}>
                <TableCell>{file.id}</TableCell>
                <TableCell className="text-nowrap">{file.title}</TableCell>
                <TableCell className="w-full"><span className="overflow-hidden line-clamp-2">{file.content}</span></TableCell>
                <TableCell className="text-nowrap">{(new Date(file.created_at)).toDateString()}</TableCell>
                <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger className="ml-auto mr-2">
                      <IoEllipsisVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <Link to={"/files/create?file_id=" + file.id}>
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={"/forward/?file_id=" + file.id}>
                          Forward
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default MyDrafts;
