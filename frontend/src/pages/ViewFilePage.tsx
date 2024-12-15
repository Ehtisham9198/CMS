import { useEffect, useState } from "react";
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
import { getActions } from "../hooks/requests";
import { useParams } from "react-router-dom";

export interface IAction {
  to_user: string;
  from_user: string;
  remarks: string;
  created_at: string;
}

function ViewFilePage() {
  const [actions, setActions] = useState<IAction[]>([]);
  const { file_id } = useParams();

  if(!file_id) {
    return <h1>File not found.</h1>
  }

  useEffect(() => {
    (async () => {
      const files = await getActions(file_id);
      setActions(files);
    })();
  }, []);

  return (
    <div className="sm:p-4 space-y-2">
      <h1>{JSON.stringify(file_id)}</h1>

      <div className="shadow">
        {/* <Table className="bg-white">
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
              <TableRow key={file.id}>
                <TableCell>{file.file_id}</TableCell>
                <TableCell className="line-clamp-1 h-9">{file.title}</TableCell>
                <TableCell>{file.forwarded_by}</TableCell>
                <TableCell>{file.created_at}</TableCell>
                <TableCell>
                  <button>
                    <IoEllipsisVertical />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table> */}
      </div>
    </div>
  );
}

export default ViewFilePage;
