"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFileName(files[0].name);
    } else {
      setFileName(null);
    }
  };

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;
    
    if (!file) {
      setError("Please select a CSV file");
      return;
    }
    
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError("Please select a valid CSV file");
      return;
    }
    
    try {
      setIsProcessing(true);
      setProcessingStatus("Processing...");
      setError(null);
      setSuccessCount(null);
      
      const response = await fetch('/api/process-csv', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process CSV');
      }
      
      // Get filename from Content-Disposition header if available
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition && contentDisposition.match(/filename="?([^"]*)"?/);
      const filename = filenameMatch ? filenameMatch[1] : 'json-files.zip';
      
      // Try to extract count from filename (json-files-XX.zip)
      const countMatch = filename.match(/json-files-(\d+)\.zip/);
      if (countMatch && countMatch[1]) {
        setSuccessCount(parseInt(countMatch[1], 10));
      }
      
      // Create a download link for the blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setProcessingStatus("Complete!");
      
      // Reset the form
      if (formRef.current) {
        formRef.current.reset();
        setFileName(null);
      }
    } catch (err) {
      console.error("Error processing file:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-50 to-white overflow-hidden text-gray-900">
      <div className="w-full max-w-4xl px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column - App Information */}
          <div>
            <h1 className="text-3xl font-light tracking-tight mb-6">
              CSV to JSON Extractor
            </h1>
            
            <p className="text-md text-gray-600 mb-8 leading-relaxed">
              Transform CSV files containing JSON data into individual 
              JSON files named by their respective slugs.
            </p>
            
            <div className="space-y-6">
              <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium mb-2">File Format</h3>
                <pre className="text-xs bg-gray-50 p-3 rounded border border-gray-100 overflow-x-auto font-['Consolas']">
                  <code>
                    Column1,<span className="text-blue-500">Slug</span>,<span className="text-green-500">JSON</span><br/>
                    Name,<span className="text-blue-500">example-1</span>,<span className="text-green-500">{"{"}"key":"value"{"}"}</span>
                  </code>
                </pre>
              </div>
            </div>
          </div>
          
          {/* Right Column - Upload Form */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <form onSubmit={handleFileUpload} ref={formRef} className="space-y-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${fileName ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <input
                  id="file-upload"
                  name="file"
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isProcessing}
                />
                
                {fileName ? (
                  <div className="text-blue-500">
                    <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="text-sm font-medium">{fileName}</p>
                    <p className="text-xs mt-1">Click to change file</p>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="text-sm font-medium">Select a CSV file</p>
                    <p className="text-xs mt-1">or drag and drop</p>
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isProcessing || !fileName}
                className="w-full py-2.5 px-4 rounded-lg transition-colors duration-200 font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Processing..." : "Extract JSON Files"}
              </button>
              
              {/* Status Messages */}
              {error && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm flex items-start">
                  <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}
              
              {!isProcessing && processingStatus === "Complete!" && (
                <div className="mt-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm flex items-start">
                  <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p>Successfully extracted {successCount} JSON file{successCount !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
