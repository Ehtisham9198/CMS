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
import { IFile } from "./Dashboard";

export interface IAction {
  id: string;
  to_user: string;
  from_user: string;
  remarks: string;
  created_at: string;
}

function ViewFilePage() {
  const [file, setFile] = useState<IFile>();
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
    // (async () => {
    //   const files = await getActions(file_id);
    //   setActions(files);
    // })();
  }, []);

  return (
    <div className="sm:p-4 space-y-2">
      <h1>{file_id}</h1>

      <p>{JSON.stringify(actions)}</p>

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
            {actions.map((action, i) => (
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
