import { getAllDesignations, getFile, SERVER_URL } from "@/hooks/requests";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { IFile } from "@/pages/Dashboard";

const defaultData = {
  remarks: "",
  to_users: "",
  action: "",
};

const Action = () => {
  const [designations, setDesignations] = useState<any[]>([]);
  const [file, setFile] = useState<IFile | null>();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(defaultData);
  const [error, setError] = useState("");

  const { file_id } = useParams();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!file_id || !data.action || (!data.to_users && data.action === "forward")) {
      console.log("All fields must be filled", file_id, data.action, data.to_users);
      setError("All fields must be filled before forwarding.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(SERVER_URL + "/api/file_forward", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file_id,
          action: data.action,
          to_users: data.to_users,
          remarks: data.remarks,
        }),
        credentials: "include",
      });
      const result = await response.json();
      console.log(result,"error")

      if (response.ok) {
        setError("");
        navigate("/file/"+file_id)
      } else {
        setError(result.error || "Failed to forward file.");
      }
    } catch (error) {
      setError("Error forwarding file. Please try again later.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!file_id) {
      return;
    }

    getFile(file_id).then(setFile);
    getAllDesignations().then(setDesignations);
  }, [file_id]);

  return (
<<<<<<< HEAD
    <div>
       <br />
        <label htmlFor="remarks">Remarks</label> <br />
        <input
          type="text"
          name="remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
        <br />
      <form onSubmit={ForwardFileHandler}>       
        <label htmlFor="action">Action</label>
        <br />
        <select
          name="action"
          id="action"
          className="border p-2"
          value={action}
          onChange={(e) => setAction(e.target.value)}
        >
          <option value="">Select Option</option>
          <option value="forward">Forward</option>
          <option value="reject">Reject</option>
          <option value="complete">Complete</option>
        </select>
=======
    <div className="p-2 sm:p-4 space-y-4">
      <h1 className="text-3xl sm:text-4xl sm:mb-4">Send File</h1>
      {error && <p className="text-destructive">{error}</p>}
>>>>>>> b0e8f338d00cbd9ec80b6b99549de5a6545bed7e

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>
            <span className="text-muted-foreground">{file?.id} </span>
            <span className="capitalize">{file?.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{file?.content}</p>
        </CardContent>
      </Card>

      <form
        className="p-2 sm:p-4 border rounded lg:rounded-lg shadow-sm gap-4 grid sm:grid-cols-2 max-w-2xl"
        onSubmit={handleSubmit}
      >
        <div className="space-y-1">
          <label htmlFor="content">
            Action Type<span className="text-red-500">*</span>
          </label>

          <Select
            onValueChange={(val) =>
              setData((prev) => ({ ...prev, action: val }))
            }
            value={data.action}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Designation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="text-blue-500 focus:bg-blue-500 focus:text-blue-50" value="forward">
                Forward
              </SelectItem>
              <SelectItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground" value="reject">
                Reject
              </SelectItem>
              <SelectItem className="text-green-500 focus:bg-green-500 focus:text-green-50" value="complete">
                Complete
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {data.action === "forward" && (
          <div className="space-y-1">
          <label htmlFor="content">
            Forward to<span className="text-red-500">*</span>
          </label>

          <Select
            onValueChange={(val) =>
              setData((prev) => ({ ...prev, to_users: val }))
            }
            value={data.to_users}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Designation" />
            </SelectTrigger>
            <SelectContent>
              {designations.map(({ designation }) => (
                <SelectItem key={designation} value={designation}>
                  {designation.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        )}

        <div className="sm:col-span-2 space-y-1">
          <label htmlFor="remarks">
            Remarks<span className="text-red-500">*</span>
          </label>
          <Textarea
            id="remarks"
            name="remarks"
            placeholder="remarks..."
            required
            value={data.remarks}
            onChange={(e) => setData(p => ({...p, remarks: e.target.value}))}
          />
        </div>

        <Button className="sm:col-span-2" disabled={loading}>
          {loading ? "Pending..." : "Submit"}
        </Button>

      </form>
    </div>
  );
};

export default Action;
