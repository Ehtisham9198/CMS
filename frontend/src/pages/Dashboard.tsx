import { useEffect, useMemo, useState } from "react";
import { getFiles } from "../hooks/requests";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { IoEllipsisVertical } from "react-icons/io5";
import { Input } from "../components/ui/input";
import { Link } from "react-router-dom";

export interface IFile {
  id: string;
  title: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

function Dashboard() {
  const [files, setFiles] = useState<IFile[]>([]);
  const [filter, setFilter] = useState<string>("");

  const filteredList = useMemo(() => {
    const q = filter.toLowerCase();
    return files.filter(
      (file) =>
        file.title.toLowerCase().includes(q) ||
        file.created_by.toLowerCase().includes(q) ||
        file.id.toLowerCase().includes(q)
    );
  }, [filter, files]);

  useEffect(() => {
    (async () => {
      const files = await getFiles();
      setFiles(files);
    })();
  }, []);

  return (
    <div className="sm:p-4 space-y-2">
      <Input
        className="w-72 sm:w-80 max-w-full shadow"
        placeholder="search..."
        onChange={(e) => setFilter(e.target.value)}
      />

      <div className="shadow">
        <Table className="bg-white">
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>File ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Forwarded by</TableHead>
              <TableHead>Created on</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredList.map((file) => (
              <Link to={"/files/"+file.id}>
                <TableRow key={file.id}>
                  <TableCell>{file.id}</TableCell>
                  <TableCell className="line-clamp-1 h-9">{file.title}</TableCell>
                  <TableCell>{file.created_by}</TableCell>
                  <TableCell>{file.created_at}</TableCell>
                  <TableCell>
                    <button>
                      <IoEllipsisVertical />
                    </button>
                  </TableCell>
                </TableRow>
              </Link>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Dashboard;
