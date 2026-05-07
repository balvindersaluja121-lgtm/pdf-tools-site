import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { pdfTools } from "../data/mockData";

const BACKEND_URL = "https://pdf-tools-site-8js9.onrender.com";
const API = `${BACKEND_URL}/api`;

const ToolPage = () => {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  // FIXED ROUTE MATCHING
  const tool = pdfTools.find(
    (t) => t.route.replace("/", "") === toolId
  );

  if (!tool) {
    return (
      <div style={{ padding: "40px" }}>
        <h1>Tool Not Found</h1>

        <button onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
    );
  }

  // FILE SELECT
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  // PROCESS FILE
  const handleProcess = async () => {
    if (files.length === 0) {
      alert("Please select file");
      return;
    }

    setProcessing(true);

    try {
      const formData = new FormData();

      // MULTIPLE FILES FOR MERGE
      if (toolId === "merge-pdf") {
        files.forEach((file) => {
          formData.append("files", file);
        });
      } else {
        formData.append("file", files[0]);
      }

      // ENDPOINTS
      let endpoint = "";

      switch (toolId) {
        case "pdf-to-word":
          endpoint = "/pdf/pdf-to-word";
          break;

        case "jpg-to-pdf":
          endpoint = "/pdf/jpg-to-pdf";
          break;

        case "pdf-to-jpg":
          endpoint = "/pdf/pdf-to-jpg";
          break;

        case "merge-pdf":
          endpoint = "/pdf/merge-pdf";
          break;

        case "split-pdf":
          endpoint = "/pdf/split-pdf";
          break;

        case "compress-pdf":
          endpoint = "/pdf/compress-pdf";
          break;

        case "protect-pdf":
          endpoint = "/pdf/protect-pdf";
          break;

        case "unlock-pdf":
          endpoint = "/pdf/unlock-pdf";
          break;

        default:
          endpoint = "/pdf/pdf-to-word";
      }

      const response = await fetch(`${API}${endpoint}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      setDownloadUrl(url);

      setProcessing(false);

      alert("File processed successfully");

    } catch (error) {
      console.error(error);

      setProcessing(false);

      alert("Processing failed");
    }
  };

  // DOWNLOAD FILE
  const handleDownload = () => {
    if (!downloadUrl) return;

    const link = document.createElement("a");

    link.href = downloadUrl;

    // FILE NAMES
    switch (toolId) {
      case "pdf-to-word":
        link.download = "converted.docx";
        break;

      case "jpg-to-pdf":
        link.download = "converted.pdf";
        break;

      case "pdf-to-jpg":
        link.download = "converted.zip";
        break;

      case "merge-pdf":
        link.download = "merged.pdf";
        break;

      default:
        link.download = "download";
    }

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: "40px" }}>

      <button onClick={() => navigate("/")}>
        ← Back
      </button>

      <h1 style={{ marginTop: "20px" }}>
        {tool.name}
      </h1>

      <p>{tool.description}</p>

      <div
        style={{
          border: "2px dashed gray",
          padding: "40px",
          marginTop: "20px",
          cursor: "pointer",
        }}
        onClick={() => fileInputRef.current.click()}
      >
        Click to Upload File
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple={toolId === "merge-pdf"}
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />

      {files.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Selected Files:</h3>

          {files.map((file, index) => (
            <p key={index}>{file.name}</p>
          ))}

          <button
            onClick={handleProcess}
            disabled={processing}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
            }}
          >
            {processing ? "Processing..." : "Process"}
          </button>
        </div>
      )}

      {downloadUrl && (
        <div style={{ marginTop: "30px" }}>
          <button
            onClick={handleDownload}
            style={{
              padding: "10px 20px",
            }}
          >
            Download File
          </button>
        </div>
      )}

    </div>
  );
};

export default ToolPage;
