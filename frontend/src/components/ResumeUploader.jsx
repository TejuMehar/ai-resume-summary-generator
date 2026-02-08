import { useState } from "react";
import axios from "axios";

function ResumeUploader() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Please select a valid PDF file");
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a PDF file");
      return;
    }

    setLoading(true);
    setError("");
    setSummary("");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/resume/generate",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      setSummary(response.data.summary);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate summary");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setSummary("");
    setError("");
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Main card with glassmorphism */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload area */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              Upload Your Resume
            </label>
            <div
              className={`relative transition-all duration-300 ${
                dragActive ? "scale-105" : ""
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <label
                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
                  dragActive
                    ? "border-pink-400 bg-pink-500/20"
                    : "border-purple-400/50 bg-white/5 hover:bg-white/10 hover:border-purple-400"
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="mb-4 p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <p className="mb-2 text-sm text-gray-200">
                    <span className="font-semibold text-purple-300">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">PDF (MAX. 2MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {file && (
              <div className="mt-4 flex items-center gap-3 p-4 bg-green-500/20 backdrop-blur-sm rounded-xl border border-green-400/30">
                <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{file.name}</p>
                  <p className="text-xs text-gray-300">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-200 px-4 py-3 rounded-xl flex items-start gap-3">
              <svg
                className="w-5 h-5 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !file}
              className="flex-1 relative group bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 disabled:transform-none"
            >
              <span className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              {loading ? (
                <span className="flex items-center justify-center relative z-10">
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generating Magic...
                </span>
              ) : (
                <span className="flex items-center justify-center relative z-10">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Generate Summary
                </span>
              )}
            </button>

            {(file || summary) && (
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl font-semibold text-white hover:bg-white/20 transition-all duration-300"
              >
                Reset
              </button>
            )}
          </div>
        </form>

        {/* Summary display */}
        {summary && (
          <div className="mt-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl border border-purple-400/30 p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2 rounded-lg mr-3">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                Your Professional Summary
              </h3>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300 font-medium text-sm"
              >
                {copied ? (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10">
              <p className="text-gray-100 leading-relaxed text-lg whitespace-pre-wrap">
                {summary}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center mt-8 text-gray-400 text-sm">
        <p className="flex items-center justify-center gap-2">
          <span>Powered by</span>
          <span className="font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Tejas Mehar
          </span>
        </p>
      </footer>
    </div>
  );
}

export default ResumeUploader;
