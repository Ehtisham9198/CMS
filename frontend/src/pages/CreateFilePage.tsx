import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getFile, SERVER_URL } from "@/hooks/requests";
import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IFile } from "./Dashboard";

interface IFormData {
  id?: string;
  title?: string;
  content?: string;
}

interface ErrType extends IFormData {
  message?: string;
}

function CreateFilePage() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<ErrType>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [file, setFile] = useState<IFile | null>();

  const navigate = useNavigate();
  setSearchParams()

  function validFileId(title?: string): string | undefined {
    if (!title) {
      return "Id cannot be empty";
    }

    for (const char of title) {
      if (
        char !== "_" &&
        !(char >= "a" && char <= "z") &&
        !(char >= "A" && char <= "Z") &&
        !(char >= "0" && char <= "9")
      ) {
        return "file id can only contain alphabets, numbers and underscores '_'";
      }
    }

    return undefined;
  }

  function handleIdBlur(e: React.FocusEvent<HTMLInputElement, Element>) {
    const idErr = validFileId(e.target.value);

    if (idErr) {
      setErr({ id: idErr });
    } else {
      setErr({ id: undefined });
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let err: ErrType = {};

    const formData = new FormData(e.currentTarget);

    if(file?.id) {
      formData.append("id", file.id);
    }
    err.id = validFileId(formData.get("id")?.toString());

    if (!formData.get("id")) {
      err.id = "id cannot be empty";
    }
    if (!formData.get("title")) {
      err.title = "title cannot be empty";
    }
    if (!formData.get("content")) {
      err.content = "content cannot be empty";
    }

    if (err.id || err.content || err.title) {
      setErr(err);
      return;
    } else {
      setErr(undefined);
    }

    setLoading(true);

    try {
      const response = await fetch(SERVER_URL + "/api/initiate_file", {
        method: file && file.id ? "PUT" : "POST",
        body: formData,
        credentials: "include",
      });

      const result = await response.json();
      if (response.ok) {
        navigate("/files");
      } else {
        setErr({ message: result.error || "Error initiating file" });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErr({ message: "An error occurred. Please try again." });
    }

    setLoading(false);
  }

  useEffect(() => {
    const file_id = searchParams.get("file_id");
    if (file_id) {
      getFile(file_id).then(setFile);
    }
  }, [searchParams]);

  return (
    <div className="p-2 sm:p-4">
      <h1 className="text-2xl sm:text-4xl sm:mb-4">Create File</h1>
      {err?.message && <p className="text-destructive">{err.message}</p>}

      <form
        className="p-2 gap-4 grid sm:grid-cols-2 max-w-2xl"
        onSubmit={handleSubmit}
      >
          <div className="space-y-1">
            <label htmlFor="id">
              File ID<span className="text-red-500">*</span>
            </label>
            <Input
              onBlur={handleIdBlur}
              id="id"
              name="id"
              placeholder="file id..."
              required
              disabled={!!file?.id}
              defaultValue={file?.id}
            />
            {err?.id && <p className="text-destructive">{err.id}</p>}
          </div>
        <div className="space-y-1">
          <label htmlFor="title">
            Title<span className="text-red-500">*</span>
          </label>
          <Input
            id="title"
            name="title"
            placeholder="file id..."
            required
            defaultValue={file?.title}
          />
          {err?.title && <p className="text-destructive">{err.title}</p>}
        </div>
        <div className="sm:col-span-2 space-y-1">
          <label htmlFor="content">
            Content<span className="text-red-500">*</span>
          </label>
          <Textarea
            id="content"
            name="content"
            rows={7}
            placeholder="content..."
            required
            defaultValue={file?.content}
          />
          {err?.content && <p className="text-destructive">{err.content}</p>}
        </div>

        <div>
          <label htmlFor="file">Attachments</label>
          <Input type="file" multiple name="file" />
        </div>

        <Button className="sm:col-span-2" disabled={loading}>
          {loading ? "Pending..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}

export default CreateFilePage;
