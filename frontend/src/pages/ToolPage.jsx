return (
  <div
    style={{
      minHeight: "100vh",
      background: "#f5f7fb",
      padding: "40px",
      fontFamily: "Arial"
    }}
  >

    <button
      onClick={() => navigate("/")}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        fontSize: "16px",
        marginBottom: "30px"
      }}
    >
      ← Back
    </button>

    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        background: "#fff",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
      }}
    >

      <h1
        style={{
          fontSize: "36px",
          marginBottom: "10px",
          color: "#111"
        }}
      >
        {tool.name}
      </h1>

      <p
        style={{
          color: "#666",
          marginBottom: "30px",
          fontSize: "18px"
        }}
      >
        {tool.description}
      </p>

      <div
        onClick={() => fileInputRef.current.click()}
        style={{
          border: "3px dashed #4F46E5",
          borderRadius: "14px",
          padding: "60px",
          textAlign: "center",
          cursor: "pointer",
          background: "#EEF2FF"
        }}
      >
        <h2 style={{ color: "#4F46E5" }}>
          Click to Upload File
        </h2>

        <p style={{ color: "#666" }}>
          Drag & drop files here
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple={toolId === "merge-pdf"}
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />

      {files.length > 0 && (
        <div style={{ marginTop: "30px" }}>

          <h3>Selected Files</h3>

          {files.map((file, index) => (
            <div
              key={index}
              style={{
                background: "#f3f4f6",
                padding: "12px",
                borderRadius: "8px",
                marginTop: "10px"
              }}
            >
              {file.name}
            </div>
          ))}

          <button
            onClick={handleProcess}
            disabled={processing}
            style={{
              marginTop: "30px",
              background: "#4F46E5",
              color: "#fff",
              border: "none",
              padding: "14px 30px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold"
            }}
          >
            {processing ? "Processing..." : "Process File"}
          </button>

        </div>
      )}

      {downloadUrl && (
        <div style={{ marginTop: "30px" }}>
          <button
            onClick={handleDownload}
            style={{
              background: "#16A34A",
              color: "#fff",
              border: "none",
              padding: "14px 30px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold"
            }}
          >
            Download File
          </button>
        </div>
      )}

    </div>

  </div>
);
