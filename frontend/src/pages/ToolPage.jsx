const handleProcess = async () => {
  if (files.length === 0) {
    toast({
      title: 'No files selected',
      description: 'Please select files to process',
      variant: 'destructive'
    });
    return;
  }

  setProcessing(true);
  setProgress(0);
  setError(null);

  let progressValue = 0;

  const interval = setInterval(() => {
    progressValue += 20;
    setProgress(progressValue);

    if (progressValue >= 100) {
      clearInterval(interval);
      setProcessing(false);
      setCompleted(true);

      // Demo output (returns same file)
      const url = URL.createObjectURL(files[0]);
      setDownloadUrl(url);

      toast({
        title: 'Processing complete!',
        description: 'Demo mode (no backend yet)',
      });
    }
  }, 400);
};
