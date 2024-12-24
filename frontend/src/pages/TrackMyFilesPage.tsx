import { useEffect, useMemo, useState } from "react";

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
import { TrackMyFiles } from "@/hooks/requests";
import { IFile } from "./Dashboard";



function TrackMyFilesPage() {
  const [files, setFiles] = useState<IFile[]>([]);
  const [filter, setFilter] = useState<string>("");
  const session = useSession();

  const filteredList = useMemo(() => {
    const q = filter.toLowerCase();
    return files.filter(
      (file) =>
        file.title.toLowerCase().includes(q) ||
        file.forwarded_by?.toLowerCase().includes(q) ||
        file.uploaded_by?.toLowerCase().includes(q) ||
        file.id.toLowerCase().includes(q) ||
        file.status.toLowerCase().includes(q)
    );
  }, [filter, files]);

  useEffect(() => {
    (async () => {
      const files = await TrackMyFiles();
      setFiles(files);
      console.log(files);
    })();
  }, [session?.user?.designation]);




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
              <TableHead className="text-nowrap">Current Holder</TableHead>
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
                  {file.forwarded_by || file.uploaded_by}
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
                      <DropdownMenuItem>
                        <FileDetails fileId={file.id} />
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

export default TrackMyFilesPage;
