import { getAllDesignations, getFile, SERVER_URL } from "@/hooks/requests";
import { IFile } from "@/pages/Dashboard";
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const defaultData = {
  remarks: "",
  to_users: "",
};

const CreatedFiles = () => {
  const [designations, setDesignations] = useState<any[]>([]);
  const [file, setFile] = useState<IFile | null>();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(defaultData);
  const [error, setError] = useState("");

  const file_id = useSearchParams()[0].get("file_id");
  const navigate = useNavigate();

  console.log({ file, file_id, designations });

  function handleChange(e: React.ChangeEvent<any>) {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  useEffect(() => {
    if (!file_id) {
      return;
    }

    getFile(file_id).then(setFile);
    getAllDesignations().then(setDesignations);
  }, [file_id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file_id || !data.to_users) {
      setError("All fields must be filled before forwarding.");
      return;
    }

    try {
      const response = await fetch(SERVER_URL + "/api/file_forward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_id: file_id,
          action: "Send",
          to_users: data.to_users,
          remarks: data.remarks,
        }),
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        setError("");
        navigate("/file/" + file_id);
      } else {
        setError(result.error || "Failed to forward file.");
      }
    } catch (error) {
      console.log(error);
      setError("Error forwarding file. Please try again.");
    }
  };

  if (!file_id) {
    return <h1>File not found.</h1>;
  }

  return (
    <div className="p-2 sm:p-4 space-y-4">
      <h1 className="text-3xl sm:text-4xl sm:mb-4">Send File</h1>
      {error && <p className="text-destructive">{error}</p>}

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>
            <span className="text-muted-foreground">#{file?.id} </span>
            <span className="capitalize">{file?.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{file?.content}</p>
        </CardContent>
      </Card>

      <form
        className="p-2 lg:p-4 border rounded lg:rounded-lg shadow-sm gap-4 grid sm:grid-cols-2 max-w-2xl"
        onSubmit={handleSubmit}
      >
        <div className="space-y-1">
          <label htmlFor="content">
            Send to<span className="text-red-500">*</span>
          </label>

          <Select onValueChange={(val) => setData(prev => ({...prev, to_users: val}))} value={data.to_users}>
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
            onChange={handleChange}
          />
        </div>
        <Button className="sm:col-span-2" disabled={loading}>
          {loading ? "Pending..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default CreatedFiles;
