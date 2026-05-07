// REAL BACKEND PROCESS
const handleProcess = async () => {

  if (files.length === 0) {
    toast({
      title: 'No files selected',
      description: 'Please select files',
      variant: 'destructive'
    });
    return;
  }

  setProcessing(true);
  setProgress(30);
  setError(null);

  try {

    const formData = new FormData();

    // Multiple files for merge
    files.forEach((file) => {
      formData.append("files", file);
    });

    // Single file support
    formData.append("file", files[0]);

    let endpoint = "";

    switch(toolId) {

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
      body: formData
    });

    if (!response.ok) {
      throw new Error("Server error");
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    setDownloadUrl(url);

    setCompleted(true);

    setProcessing(false);

    setProgress(100);

    toast({
      title: "Success",
      description: "File processed successfully"
    });

  } catch (err) {

    setProcessing(false);

    setError("Processing failed");

    toast({
      title: "Error",
      description: "Backend not responding",
      variant: "destructive"
    });
  }
};
