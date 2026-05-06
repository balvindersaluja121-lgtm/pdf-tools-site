import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pdfTools } from '../data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Upload, Download, ArrowLeft, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { Progress } from '../components/ui/progress';

const ToolPage = () => {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);

  const tool = pdfTools.find(t => t.route === `/${toolId}`);

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Tool not found</CardTitle>
            <CardDescription>This tool does not exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setCompleted(false);
    setProgress(0);
    setError(null);
    setDownloadUrl(null);
  };

  // ✅ DEMO MODE PROCESS (NO BACKEND)
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

        // return same file as demo output
        const url = URL.createObjectURL(files[0]);
        setDownloadUrl(url);

        toast({
          title: 'Processing complete!',
          description: 'Demo mode (no backend yet)',
        });
      }
    }, 400);
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = files[0]?.name || 'file.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">

      {/* HEADER */}
      <Button variant="ghost" onClick={() => navigate('/')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <h1 className="text-3xl font-bold mb-6">{tool.name}</h1>

      {/* UPLOAD */}
      {!completed ? (
        <Card>
          <CardContent className="p-6 text-center">
            <div
              className="border-2 border-dashed p-10 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto mb-4" size={40} />
              <p>Select or upload file</p>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {files.length > 0 && (
              <div className="mt-4">
                <p>{files[0].name}</p>

                {processing && (
                  <Progress value={progress} className="mt-2" />
                )}

                {error && (
                  <p className="text-red-500 mt-2">{error}</p>
                )}

                <Button className="mt-4" onClick={handleProcess}>
                  {processing ? 'Processing...' : 'Process'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="mx-auto text-green-600 mb-4" size={40} />
            <h2 className="text-xl mb-4">Done!</h2>

            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ToolPage;
