const BACKEND_URL = "https://pdf-tools-site-8js9.onrender.com";
const API = `${BACKEND_URL}/api`;

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
    formData.append("file", files[0]);

    const response = await fetch(`${API}/pdf/pdf-to-word`, {
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
      description: "File converted successfully"
    });

  } catch (err) {
    setProcessing(false);
    setError("Conversion failed");

    toast({
      title: "Error",
      description: "Backend not responding",
      variant: "destructive"
    });
  }
};
