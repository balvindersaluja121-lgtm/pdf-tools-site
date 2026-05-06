import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pdfTools } from '../data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Upload, Download, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { Progress } from '../components/ui/progress';

const BACKEND_URL = "https://pdf-tools-site-8js9.onrender.com";
const API = `${BACKEND_URL}/api`;

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

  // File select
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setCompleted(false);
    setProgress(0);
    setError(null);
    setDownloadUrl(null);
  };

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

  // Download
  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "converted.docx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">

      <Button variant="ghost" onClick={() => navigate('/')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <h1 className="text-3xl font-bold mb-6">{tool.name}</h1>

      {!completed ? (
        <Card>
          <CardContent className="p-6 text-center">

            <div
              className="border-2 border-dashed p-10 cursor-pointer hover:border-red-500"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto mb-4" size={40} />
              <p>Select or upload file(s)</p>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {files.length > 0 && (
              <div className="mt-4 text-left">
                <h4 className="font-semibold mb-2">Selected files:</h4>

                {files.map((file, index) => (
                  <p key={index} className="text-sm">{file.name}</p>
                ))}

                {processing && (
                  <Progress value={progress} className="mt-3" />
                )}

                {error && (
                  <p className="text-red-500 mt-2">{error}</p>
                )}

                <Button className="mt-4 w-full" onClick={handleProcess}>
                  {processing ? 'Processing...' : `Process ${tool.name}`}
                </Button>
              </div>
            )}

          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="mx-auto text-green-600 mb-4" size={40} />
            <h2 className="text-xl mb-4">Processing complete!</h2>

            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>

            <Button
              variant="outline"
              className="mt-3 ml-2"
              onClick={() => {
                setFiles([]);
                setCompleted(false);
                setProgress(0);
                setDownloadUrl(null);
                setError(null);
              }}
            >
              Process another file
            </Button>

          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ToolPage;
