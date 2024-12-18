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
import { getActions, getFile } from "../hooks/requests";
import { useParams } from "react-router-dom";
import { IFile } from "./Dashboard";

export interface IAction {
  id: string;
  from_user: string;
  remarks: string;
  to_user: string;
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
      <h1 className="text-3xl my-4"><span className="text-muted-foreground">#{file?.id}</span> {file?.title}</h1>

      <div className="shadow">
        <Table className="bg-white">
          <TableHeader>
            <TableRow>
              <TableHead className="w-40">Date</TableHead>
              <TableHead className="w-full">Remarks</TableHead>
              <TableHead className="text-nowrap">Updated by</TableHead>
              <TableHead className="text-nowrap">Forwarded to</TableHead>
              <TableHead className="w-24">Attachments</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actions.length > 0 ? actions.map((action) => (
              <TableRow key={action.id}>
                <TableCell className="text-nowrap">{(new Date(action.created_at)).toDateString()}</TableCell>
                <TableCell className="grow">{action.remarks}</TableCell>
                <TableCell>{action.from_user}</TableCell>
                <TableCell>{action.to_user}</TableCell>
                <TableCell>
                  <button>
                    <IoEllipsisVertical />
                  </button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow className="col-span-2">
                <TableCell className="text-center text-l h-40" colSpan={5}>
                  No updates found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ViewFilePage;
