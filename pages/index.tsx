import { ChangeEvent, useState } from "react";
import axios from "axios";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      const file = e.target.files[0];
      await handleUpload(file);
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

  return (
    <div>
      <input type="file" onChange={(e) => handleChange(e)} />
      <img src={selectedFile} />
    </div>
  );
}
