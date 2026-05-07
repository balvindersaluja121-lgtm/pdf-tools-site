import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const API = "https://pdf-tools-site-8js9.onrender.com";

export default function ToolPage() {

  const location = useLocation();

  const toolSlug = location.pathname.replace("/", "");

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {

    if (!file) {
      alert("Please select file");
      return;
    }

    setLoading(true);

    try {

      const formData = new FormData();

      if (
        toolSlug === "merge-pdf"
      ) {
        for (let i = 0; i < file.length; i++) {
          formData.append("files", file[i]);
        }
      } else {
        formData.append("file", file);
      }

      let endpoint = "";

      switch (toolSlug) {

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
        throw new Error("Backend route may not exist");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;

      if (toolSlug === "pdf-to-word") {
        a.download = "converted.docx";
      }
      else if (toolSlug === "jpg-to-pdf") {
        a.download = "converted.pdf";
      }
      else if (toolSlug === "pdf-to-jpg") {
        a.download = "converted.zip";
      }
      else if (toolSlug === "merge-pdf") {
        a.download = "merged.pdf";
      }
      else if (toolSlug === "split-pdf") {
        a.download = "split.pdf";
      }
      else if (toolSlug === "compress-pdf") {
        a.download = "compressed.pdf";
      }
      else if (toolSlug === "protect-pdf") {
        a.download = "protected.pdf";
      }
      else if (toolSlug === "unlock-pdf") {
        a.download = "unlocked.pdf";
      }

      document.body.appendChild(a);

      a.click();

      a.remove();

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
        background: "#fff7ed",
        padding: "40px",
        textAlign: "center",
      }}
    >

      <h1
        style={{
          color: "#ea580c",
          fontSize: "40px",
          marginBottom: "20px",
        }}
      >
        {toolSlug.replace(/-/g, " ").toUpperCase()}
      </h1>

      <input
        type="file"
        multiple={toolSlug === "merge-pdf"}
        onChange={(e) =>
          toolSlug === "merge-pdf"
            ? setFile(e.target.files)
            : setFile(e.target.files[0])
        }
        style={{
          marginBottom: "20px",
        }}
      />

      <br />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          background: "#ea580c",
          color: "white",
          border: "none",
          padding: "14px 28px",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "18px",
        }}
      >
        {loading ? "Processing..." : "Convert Now"}
      </button>

    </div>
  );
}
