import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = "https://pdf-tools-site-8js9.onrender.com";

export default function ToolPage() {
  const { tool } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const getTitle = () => {
    switch (tool) {
      case "pdf-to-word":
        return "PDF to Word";

      case "jpg-to-pdf":
        return "JPG to PDF";

      case "pdf-to-jpg":
        return "PDF to JPG";

      case "merge-pdf":
        return "Merge PDF";

      case "split-pdf":
        return "Split PDF";

      case "compress-pdf":
        return "Compress PDF";

      case "protect-pdf":
        return "Protect PDF";

      case "unlock-pdf":
        return "Unlock PDF";

      default:
        return "PDF Tool";
    }
  };

  const getDescription = () => {
    switch (tool) {
      case "pdf-to-word":
        return "Convert PDF files into editable Word documents";

      case "jpg-to-pdf":
        return "Convert JPG images into PDF";

      case "pdf-to-jpg":
        return "Convert PDF pages into JPG images";

      case "merge-pdf":
        return "Merge multiple PDF files into one";

      case "split-pdf":
        return "Split PDF pages";

      case "compress-pdf":
        return "Reduce PDF size";

      case "protect-pdf":
        return "Add password protection";

      case "unlock-pdf":
        return "Remove PDF password";

      default:
        return "Easy PDF tool";
    }
  };

  const getEndpoint = () => {
    switch (tool) {
      case "pdf-to-word":
        return "/pdf/pdf-to-word";

      case "jpg-to-pdf":
        return "/pdf/jpg-to-pdf";

      case "pdf-to-jpg":
        return "/pdf/pdf-to-jpg";

      case "merge-pdf":
        return "/pdf/merge-pdf";

      case "split-pdf":
        return "/pdf/split-pdf";

      case "compress-pdf":
        return "/pdf/compress-pdf";

      case "protect-pdf":
        return "/pdf/protect-pdf";

      case "unlock-pdf":
        return "/pdf/unlock-pdf";

      default:
        return "/pdf/pdf-to-word";
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${API}${getEndpoint()}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "converted-file";
      a.click();

    } catch (error) {
      alert("Tool failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <button
        onClick={() => navigate("/")}
        style={{
          padding: "10px 18px",
          border: "none",
          borderRadius: "8px",
          background: "#2563eb",
          color: "white",
          cursor: "pointer",
          marginBottom: "30px",
        }}
      >
        ← Back
      </button>

      <div
        style={{
          maxWidth: "700px",
          margin: "auto",
          background: "white",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            marginBottom: "10px",
            color: "#111827",
          }}
        >
          {getTitle()}
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginBottom: "30px",
          }}
        >
          {getDescription()}
        </p>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{
            marginBottom: "20px",
          }}
        />

        <br />

        <button
          onClick={handleUpload}
          disabled={loading}
          style={{
            padding: "14px 24px",
            border: "none",
            borderRadius: "10px",
            background: "#2563eb",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          {loading ? "Processing..." : "Upload & Convert"}
        </button>
      </div>
    </div>
  );
}
