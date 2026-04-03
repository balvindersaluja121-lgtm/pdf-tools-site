import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pdfTools } from '../data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Upload, Download, ArrowLeft, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { Progress } from '../components/ui/progress';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
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

  // Map tool IDs to backend endpoints and file requirements
  const toolConfig = {
    'merge-pdf': { endpoint: '/pdf/merge', multiple: true, accept: '.pdf', implemented: true },
    'split-pdf': { endpoint: '/pdf/split', multiple: false, accept: '.pdf', implemented: true },
    'compress-pdf': { endpoint: '/pdf/compress', multiple: false, accept: '.pdf', implemented: true },
    'pdf-to-word': { endpoint: '/pdf/pdf-to-word', multiple: false, accept: '.pdf', implemented: true },
    'word-to-pdf': { endpoint: '/pdf/word-to-pdf', multiple: false, accept: '.docx', implemented: true },
    'pdf-to-jpg': { endpoint: '/pdf/pdf-to-jpg', multiple: false, accept: '.pdf', implemented: true },
    'jpg-to-pdf': { endpoint: '/pdf/jpg-to-pdf', multiple: true, accept: '.jpg,.jpeg', implemented: true },
    'jpg-to-word': { endpoint: '/pdf/jpg-to-word', multiple: true, accept: '.jpg,.jpeg', implemented: true },
    'word-to-jpg': { endpoint: '/pdf/word-to-jpg', multiple: false, accept: '.docx', implemented: true },
    'unlock-pdf': { endpoint: '/pdf/unlock-pdf', multiple: false, accept: '.pdf', implemented: true },
    'protect-pdf': { endpoint: '/pdf/protect-pdf', multiple: false, accept: '.pdf', implemented: true },
    'organize-pdf': { endpoint: '/pdf/organize-pdf', multiple: false, accept: '.pdf', implemented: true },
    'rotate-pdf': { endpoint: '/pdf/rotate-pdf', multiple: false, accept: '.pdf', implemented: true },
    'page-numbers': { endpoint: '/pdf/add-page-numbers', multiple: false, accept: '.pdf', implemented: true },
    'watermark-pdf': { endpoint: '/pdf/watermark-pdf', multiple: false, accept: '.pdf', implemented: true },
    'watermark': { endpoint: '/pdf/watermark-pdf', multiple: false, accept: '.pdf', implemented: true },
    'crop-pdf': { endpoint: '/pdf/crop-pdf', multiple: false, accept: '.pdf', implemented: true },
    'redact-pdf': { endpoint: '/pdf/redact-pdf', multiple: false, accept: '.pdf', implemented: true },
    'pdf-to-excel': { endpoint: '/pdf/pdf-to-excel', multiple: false, accept: '.pdf', implemented: true },
    'pdf-to-powerpoint': { endpoint: '/pdf/pdf-to-powerpoint', multiple: false, accept: '.pdf', implemented: true },
    'powerpoint-to-pdf': { endpoint: '/pdf/powerpoint-to-pdf', multiple: false, accept: '.pptx', implemented: true },
    'html-to-pdf': { endpoint: '/pdf/html-to-pdf', multiple: false, accept: '.html', implemented: true },
    'ocr-pdf': { endpoint: '/pdf/ocr-pdf', multiple: false, accept: '.pdf', implemented: true },
    'repair-pdf': { endpoint: '/pdf/repair-pdf', multiple: false, accept: '.pdf', implemented: true },
    'pdf-to-pdfa': { endpoint: '/pdf/pdf-to-pdfa', multiple: false, accept: '.pdf', implemented: true },
  };

  const config = toolConfig[toolId];
  const isImplemented = config?.implemented || false;

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
    setError(null);
    setDownloadUrl(null);
  };

  const handleProcess = async () => {
    if (files.length === 0) {
      toast({
        title: 'No files selected',
        description: 'Please select files to process',
        variant: 'destructive'
      });
      return;
    }

    // Check if tool is implemented
    if (!isImplemented) {
      toast({
        title: 'Coming Soon',
        description: 'This tool is currently under development',
        variant: 'destructive'
      });
      return;
    }

    setProcessing(true);
    setProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      
      if (config.multiple) {
        files.forEach(file => formData.append('files', file));
      } else {
        formData.append('file', files[0]);
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await axios.post(`${API}${config.endpoint}`, formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      clearInterval(progressInterval);
      setProgress(100);

      // Create download URL
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);

      setProcessing(false);
      setCompleted(true);

      toast({
        title: 'Processing complete!',
        description: 'Your file is ready to download',
      });
    } catch (err) {
      setProcessing(false);
      setError(err.response?.data?.detail || err.message || 'Processing failed');
      toast({
        title: 'Processing failed',
        description: err.response?.data?.detail || 'An error occurred during processing',
        variant: 'destructive'
      });
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Determine file extension based on tool
      let filename = 'processed';
      const zipTools = ['split-pdf', 'pdf-to-jpg', 'word-to-jpg'];
      const wordTools = ['pdf-to-word', 'jpg-to-word'];
      const pdfTools = ['word-to-pdf', 'jpg-to-pdf', 'merge-pdf', 'compress-pdf', 'unlock-pdf', 'protect-pdf', 'organize-pdf', 'rotate-pdf', 'watermark-pdf', 'watermark', 'crop-pdf', 'redact-pdf', 'repair-pdf', 'pdf-to-pdfa', 'page-numbers', 'html-to-pdf', 'ocr-pdf', 'powerpoint-to-pdf'];
      
      if (zipTools.includes(toolId)) {
        filename = `${toolId}_output.zip`;
      } else if (wordTools.includes(toolId)) {
        filename = files[0].name.replace(/\.(pdf|jpg|jpeg)$/i, '.docx');
      } else if (toolId === 'pdf-to-excel') {
        filename = files[0].name.replace('.pdf', '.xlsx');
      } else if (toolId === 'pdf-to-powerpoint') {
        filename = files[0].name.replace('.pdf', '.pptx');
      } else if (pdfTools.includes(toolId)) {
        filename = files[0].name.replace(/\.(docx|jpg|jpeg|pptx|html)$/i, '.pdf');
        if (!filename.endsWith('.pdf')) {
          filename = `${toolId.replace('-', '_')}.pdf`;
        }
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
              {!isImplemented && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm">
                  <AlertCircle className="h-4 w-4" />
                  Coming Soon - Under Development
                </div>
              )}
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
                  <h3 className="text-xl font-semibold mb-2">
                    Select {config?.accept === '.docx' ? 'Word file' : 
                           config?.accept?.includes('.jpg') ? 'image files' : 
                           'PDF file'}{config?.multiple ? 's' : ''}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    or drop files here
                  </p>
                  <Button className="bg-brand-orange hover:bg-brand-orange-dark text-white">
                    Select files
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple={config?.multiple}
                    accept={config?.accept || '.pdf'}
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
                          <FileText className="h-5 w-5 text-brand-orange" />
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

                    {error && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-brand-orange flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-red-900 mb-1">Processing Failed</h4>
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white"
                      onClick={handleProcess}
                      disabled={processing || !isImplemented}
                    >
                      {processing ? 'Processing...' : `Process with ${tool.name}`}
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
                    className="bg-brand-orange hover:bg-brand-orange-dark text-white"
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
                      setDownloadUrl(null);
                      setError(null);
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
              <p className="text-sm text-gray-600">Files processed securely</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold mb-2">High Quality</h3>
              <p className="text-sm text-gray-600">Professional results guaranteed</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ToolPage;
