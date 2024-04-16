import { ChangeEvent, useState } from "react";
import axios from "axios";

export default function Home() {
  const [selectedFiles, setSelectedFiles] = useState<string[]>();

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      const fileList = Array.from(e.target.files);

      const accessUrl = await handleMultipleUploads(fileList);
      setSelectedFiles(accessUrl);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      const response = await fetch("/api/upload", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { accessUrl, signedUrl } = await response.json();
      await axios.put(signedUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      return accessUrl;
    } catch (error) {
      console.log(error);
    }
  };

  const handleMultipleUploads = async (fileList) => {
    console.log(fileList);
    if (!fileList) return;
    const accessUrls: string[] = [];

    await Promise.all(
      fileList.map(async (file) => {
        const accessUrl = await handleUpload(file);
        if (accessUrl) {
          accessUrls.push(accessUrl);
        }
      })
    );

    console.log("Uploaded files:", accessUrls);
    return accessUrls;
  };

  return (
    <div>
      <input type="file" onChange={handleChange} multiple />
      {selectedFiles ? (
        selectedFiles.map((file: any, index) => (
          <div key={index}>
            <img src={file} alt={`File ${index}`} width="200" />
          </div>
        ))
      ) : (
        <div>No file</div>
      )}
    </div>
  );
}
