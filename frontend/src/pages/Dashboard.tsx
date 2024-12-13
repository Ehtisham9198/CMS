import { useEffect, useMemo, useState } from "react";
import { getFiles } from "../hooks/requests";
import { useNavigate } from "react-router-dom";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useSession } from "@/context/Session";

export interface IFile {
  id: string;
  title: string;
  content?: string;
  uploaded_by: string;
  created_at: string;
}

function Dashboard() {
  const [files, setFiles] = useState<IFile[]>([]);
  const [filter, setFilter] = useState<string>("");
  const navigate = useNavigate();
  const session = useSession()
  const username = session?.user?.username


  const filteredList = useMemo(() => {
    const q = filter.toLowerCase();
    return files.filter(
      (file) =>
        file.title.toLowerCase().includes(q) ||
        file.uploaded_by.toLowerCase().includes(q) ||
        file.id.toLowerCase().includes(q)
    );
  }, [filter, files]);

  useEffect(() => {
    (async () => {
      const files = await getFiles();
      setFiles(files);
      console.log(files)
    })();
  }, []);

  const actionHandler = (id: string) => {
    navigate(`/action`, { state: { id } });
  };

  const EditHandler = (id: string, uploadedBy: string) => {
    if (username === uploadedBy) {
      navigate("/files/create?file_id=" + id);
    } else {
      return;
    }
  };

  return (
    <div className="sm:p-4 space-y-2">
      <Input
        className="w-72 sm:w-80 max-w-full shadow"
        placeholder="search..."
        onChange={(e) => setFilter(e.target.value)}
      />

      <div className="shadow">
        <Table className="bg-popover">
          <TableHeader>
            <TableRow>
              <TableHead>File ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Initiated by</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Created on</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredList.map((file) => (
              <TableRow key={file.id}>
                <TableCell>{file.id}</TableCell>
                <TableCell className="line-clamp-1 h-9">{file.title}</TableCell>
                <TableCell>{file.uploaded_by}</TableCell>
                <TableCell>{file.content}</TableCell>
                <TableCell>{file.created_at}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="ml-auto mr-2">
                      <IoEllipsisVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <Link to={"/file/" + encodeURIComponent(file.id)}>
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => actionHandler(file.id)}>
                          Take Action
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => EditHandler(file.id, file.uploaded_by)}>
                        {username === file.uploaded_by && "Edit"}
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

export default Dashboard;
