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
import { getActions, getFile } from "../hooks/requests";
import { useParams } from "react-router-dom";
import { IFile } from "./Dashboard";

export interface IAction {
  id: string;
  to_user: string;
  from_user: string;
  remarks: string;
  created_at: string;
}

function ViewFilePage() {
  const [file, setFile] = useState<IFile| null>(null);
  const [actions, setActions] = useState<IAction[]>([]);
  const { file_id } = useParams();

  if(!file_id) {
    return <h1>File not found.</h1>
  }

  useEffect(() => {
    (async () => {
      const actions = await getActions(file_id);
      setActions(actions);
    })();
    (async () => {
      const file = await getFile(file_id);
      setFile(file);
    })();
  }, []);

  return (
    <div className="sm:p-4 space-y-2">
      <h1 className="text-3xl">{file?.id}: {file?.title}</h1>

      <div className="shadow">
        <Table className="bg-white">
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Updated by</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead>Forwarded to</TableHead>
              <TableHead>Attachments</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actions.map((action) => (
              <TableRow key={action.id}>
                <TableCell>{action.created_at}</TableCell>
                <TableCell>{action.from_user}</TableCell>
                <TableCell>{action.remarks}</TableCell>
                <TableCell>{action.to_user}</TableCell>
                <TableCell>
                  <button>
                    <IoEllipsisVertical />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ViewFilePage;
