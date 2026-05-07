import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = "https://pdf-tools-site-8js9.onrender.com";

export default function ToolPage() {
  const { tool } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const toolConfig = {
    "pdf-to-word": {
      title: "PDF to Word",
      description: "Convert PDF to editable Word document",
      endpoint: "/pdf/pdf-to-word",
      accept: ".pdf",
    },

    "jpg-to-pdf": {
      title: "JPG to PDF",
      description: "Convert JPG images into PDF",
      endpoint: "/pdf/jpg-to-pdf",
      accept: "image/*",
    },

    "pdf-to-jpg": {
      title: "PDF to JPG",
      description: "Convert PDF pages into JPG",
      endpoint: "/pdf/pdf-to-jpg",
      accept: ".pdf",
    },

    "merge-pdf": {
      title: "Merge PDF",
      description: "Merge multiple PDF files",
      endpoint: "/pdf/merge-pdf",
      accept: ".pdf",
    },

    "split-pdf": {
      title: "Split PDF",
      description: "Split PDF pages",
      endpoint: "/pdf/split-pdf",
      accept: ".pdf",
    },

    "compress-pdf": {
      title: "Compress PDF",
      description: "Reduce PDF file size",
      endpoint: "/pdf/compress-pdf",
      accept: ".pdf",
    },

    "protect-pdf": {
      title: "Protect PDF",
      description: "Add password protection",
      endpoint: "/pdf/protect-pdf",
      accept: ".pdf",
    },

    "unlock-pdf": {
      title: "Unlock PDF",
      description: "Remove PDF password",
      endpoint: "/pdf/unlock-pdf",
      accept: ".pdf",
    },
  };

  const currentTool = toolConfig[tool];

  const handleUpload = async () => {
    if (!file) {
      alert("Please select file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      if (tool === "merge-pdf") {
        for (let i = 0; i < file.length; i++) {
          formData.append("files", file[i]);
        }
      } else {
        formData.append("file", file);
      }

      const response = await fetch(
        `${API}${currentTool.endpoint}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Server error");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "converted-file";
      a.click();

    } catch (error) {
      console.error(error);
      alert("Tool failed. Backend route may not exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <button
        onClick={() => navigate("/")}
        style={{
          background: "#ea580c",
          color: "white",
          border: "none",
          padding: "12px 22px",
          borderRadius: "10px",
          cursor: "pointer",
          fontSize: "16px",
          marginBottom: "30px",
          fontWeight: "bold",
        }}
      >
        ← Back
      </button>

      <div
        style={{
          maxWidth: "750px",
          margin: "auto",
          background: "white",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            color: "#ea580c",
            fontSize: "36px",
            marginBottom: "10px",
          }}
        >
          {currentTool?.title || "PDF Tool"}
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: "30px",
            fontSize: "18px",
          }}
        >
          {currentTool?.description || "Easy PDF Tool"}
        </p>

        <input
          type="file"
          accept={currentTool?.accept}
          multiple={tool === "merge-pdf"}
          onChange={(e) =>
            setFile(
              tool === "merge-pdf"
                ? e.target.files
                : e.target.files[0]
            )
          }
          style={{
            marginBottom: "25px",
            fontSize: "16px",
          }}
        />

        <br />

        <button
          onClick={handleUpload}
          disabled={loading}
          style={{
            background: "#ea580c",
            color: "white",
            border: "none",
            padding: "14px 28px",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          {loading ? "Processing..." : "Upload & Convert"}
        </button>
      </div>
    </div>
  );
}
