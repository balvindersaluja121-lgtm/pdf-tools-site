import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ToolPage() {
  const { toolId } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select file");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const API = "https://pdf-tools-site-8js9.onrender.com";

      let endpoint = "";

      switch (toolId) {
        case "pdf-to-word":
          endpoint = "/api/pdf/pdf-to-word";
          break;

        case "jpg-to-pdf":
          endpoint = "/api/pdf/jpg-to-pdf";
          break;

        case "pdf-to-jpg":
          endpoint = "/api/pdf/pdf-to-jpg";
          break;

        case "merge-pdf":
          endpoint = "/api/pdf/merge-pdf";
          break;

        case "split-pdf":
          endpoint = "/api/pdf/split-pdf";
          break;

        case "compress-pdf":
          endpoint = "/api/pdf/compress-pdf";
          break;

        case "protect-pdf":
          endpoint = "/api/pdf/protect-pdf";
          break;

        case "unlock-pdf":
          endpoint = "/api/pdf/unlock-pdf";
          break;

        default:
          endpoint = "/api/pdf/pdf-to-word";
      }

      const response = await fetch(`${API}${endpoint}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Backend route failed");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "converted-file";
      document.body.appendChild(a);
      a.click();
      a.remove();

      alert("File processed successfully");
    } catch (error) {
      console.error(error);
      alert("Tool failed. Backend route may not exist.");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "40px",
      }}
    >
      <button
        onClick={() => navigate("/")}
        style={{
          background: "#ff6b00",
          color: "white",
          border: "none",
          padding: "12px 24px",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
          marginBottom: "30px",
        }}
      >
        ← Back
      </button>

      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "white",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            marginBottom: "10px",
            color: "#222",
          }}
        >
          {toolId.replace(/-/g, " ").toUpperCase()}
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: "30px",
          }}
        >
          Easy PDF tool for converting and editing files
        </p>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{
            marginBottom: "20px",
            fontSize: "16px",
          }}
        />

        <br />

        <button
          onClick={handleUpload}
          disabled={loading}
          style={{
            background: "#ff6b00",
            color: "white",
            border: "none",
            padding: "14px 30px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          {loading ? "Processing..." : "Process File"}
        </button>
      </div>
    </div>
  );
}
