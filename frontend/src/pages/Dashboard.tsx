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
import FileDetails from "@/components/generatepdf";

export interface IFile {
  id: string;
  title: string;
  content: string;
  uploaded_by: string;
  created_at: string;
  status: string;
}

function Dashboard() {
  const [files, setFiles] = useState<IFile[]>([]);
  const [filter, setFilter] = useState<string>("");
  const navigate = useNavigate();
  const session = useSession();
  const username = session?.user?.username;

  const filteredList = useMemo(() => {
    const q = filter.toLowerCase();
    return files.filter(
      (file) =>
        file.title.toLowerCase().includes(q) ||
        file.uploaded_by.toLowerCase().includes(q) ||
        file.id.toLowerCase().includes(q) ||
        file.status.toLowerCase().includes(q)
    );
  }, [filter, files]);

  useEffect(() => {
    (async () => {
      const files = await getFiles();
      setFiles(files);
      console.log(files);
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
              <TableHead className="text-nowrap">File ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Staus</TableHead>
              <TableHead className="text-nowrap">Initiated by</TableHead>
              <TableHead>Created on</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredList.map((file) => (
              <TableRow key={file.id}>
                <TableCell>{file.id}</TableCell>
                <TableCell className="w-full">{file.title}</TableCell>
                <TableCell>{file.status}</TableCell>
                <TableCell className="text-nowrap">
                  {file.uploaded_by}
                </TableCell>
                <TableCell className="text-nowrap">
                  {new Date(file.created_at).toDateString()}
                </TableCell>
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
                      {username === file.uploaded_by && (
                        <DropdownMenuItem
                          onClick={() => EditHandler(file.id, file.uploaded_by)}
                        >
                          Edit
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem>
                         <FileDetails fileId = {file.id}/>
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
