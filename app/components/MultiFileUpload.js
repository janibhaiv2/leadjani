'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './MultiFileUpload.module.css';

export default function MultiFileUpload({
  onFilesUploaded,
  title = "Merge Leads",
  subtitle = "Upload multiple CSV files to merge"
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const onDrop = useCallback(acceptedFiles => {
    setIsLoading(true);
    setError(null);

    // Check if all files are CSV
    const allCsv = acceptedFiles.every(file => file.type === 'text/csv');

    if (allCsv) {
      // Add new files to the list
      setUploadedFiles(prev => [...prev, ...acceptedFiles]);
      setIsLoading(false);
    } else {
      setError('Please upload only CSV files.');
      setIsLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: true
  });

  const handleRemoveFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProceed = () => {
    if (uploadedFiles.length === 0) {
      setError('Please upload at least one CSV file.');
      return;
    }

    onFilesUploaded(uploadedFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={styles.uploadContainer}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>

      <div
        {...getRootProps()}
        className={`${styles.dropzone} ${isDragActive ? styles.active : ''}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the CSV files here...</p>
        ) : (
          <div>
            <p>Drag & drop CSV files here, or click to select files</p>
            <p className={styles.supportedFormats}>Supported format: .csv</p>
          </div>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className={styles.filesList}>
          <h2 className={styles.filesTitle}>Uploaded Files ({uploadedFiles.length})</h2>
          {uploadedFiles.map((file, index) => (
            <div key={index} className={styles.fileItem}>
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
              </div>
              <button 
                className={styles.removeButton}
                onClick={() => handleRemoveFile(index)}
                title="Remove file"
              >
                ✕
              </button>
            </div>
          ))}
          <button 
            className={styles.proceedButton}
            onClick={handleProceed}
          >
            Proceed with {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''}
          </button>
        </div>
      )}

      {isLoading && <p className={styles.loading}>Processing your files...</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
