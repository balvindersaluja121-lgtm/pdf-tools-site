import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pdfTools } from '../data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Upload, Download, ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';
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

  const tool = pdfTools.find(t => t.route === `/${toolId}`);

  if (!tool) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Tool not found</CardTitle>
            <CardDescription>The requested tool does not exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')}>Go back home</Button>
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
  };

  const handleProcess = () => {
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

    // Simulate processing
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setProcessing(false);
          setCompleted(true);
          toast({
            title: 'Processing complete!',
            description: 'Your file is ready to download',
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleDownload = () => {
    toast({
      title: 'Download started',
      description: 'This is a demo - no actual file is being downloaded',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tool Header */}
      <section className="bg-white py-12 px-4 border-b">
        <div className="container mx-auto max-w-4xl">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to all tools
          </Button>
          <div className="flex items-start gap-4">
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: `${tool.color}15` }}
            >
              <FileText className="h-10 w-10" style={{ color: tool.color }} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{tool.name}</h1>
              <p className="text-lg text-gray-600">{tool.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Area */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {!completed ? (
            <Card>
              <CardContent className="p-8">
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-red-500 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Select PDF files</h3>
                  <p className="text-gray-600 mb-4">
                    or drop files here
                  </p>
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
                    Select files
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>

                {files.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Selected files:</h4>
                    <ul className="space-y-2 mb-6">
                      {files.map((file, index) => (
                        <li key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                          <FileText className="h-5 w-5 text-red-600" />
                          <span className="text-sm flex-1">{file.name}</span>
                          <span className="text-sm text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </li>
                      ))}
                    </ul>

                    {processing && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Processing...</span>
                          <span className="text-sm text-gray-600">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    )}

                    <Button
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                      onClick={handleProcess}
                      disabled={processing}
                    >
                      {processing ? 'Processing...' : `Process ${tool.name}`}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle2 className="h-16 w-16 mx-auto text-green-600 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Processing complete!</h3>
                <p className="text-gray-600 mb-6">
                  Your file has been processed successfully
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFiles([]);
                      setCompleted(false);
                      setProgress(0);
                    }}
                  >
                    Process another file
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-8 text-center">Why use our {tool.name} tool?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="font-semibold mb-2">Fast Processing</h3>
              <p className="text-sm text-gray-600">Process files in seconds</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-semibold mb-2">Secure & Private</h3>
              <p className="text-sm text-gray-600">Files deleted after processing</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold mb-2">100% Free</h3>
              <p className="text-sm text-gray-600">No registration required</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ToolPage;
