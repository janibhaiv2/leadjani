'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import styles from './CrossCheckUpload.module.css';

export default function CrossCheckUpload({
  onFilesUploaded,
  title = "Cross-Check Leads",
  subtitle = "Upload two CSV files to check for duplicates"
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [primaryFile, setPrimaryFile] = useState(null);
  const [secondaryFile, setSecondaryFile] = useState(null);

  const onDropPrimary = useCallback(acceptedFiles => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    if (file.type === 'text/csv') {
      setPrimaryFile(file);
    } else {
      setError('Please upload a valid CSV file for the primary file.');
    }
  }, []);

  const onDropSecondary = useCallback(acceptedFiles => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    if (file.type === 'text/csv') {
      setSecondaryFile(file);
    } else {
      setError('Please upload a valid CSV file for the secondary file.');
    }
  }, []);

  const { getRootProps: getPrimaryRootProps, getInputProps: getPrimaryInputProps, isDragActive: isPrimaryDragActive } = useDropzone({
    onDrop: onDropPrimary,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false
  });

  const { getRootProps: getSecondaryRootProps, getInputProps: getSecondaryInputProps, isDragActive: isSecondaryDragActive } = useDropzone({
    onDrop: onDropSecondary,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false
  });

  const handleRemovePrimary = () => {
    setPrimaryFile(null);
  };

  const handleRemoveSecondary = () => {
    setSecondaryFile(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleProceed = async () => {
    if (!primaryFile || !secondaryFile) {
      setError('Please upload both primary and secondary CSV files.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Parse primary file
      const primaryResult = await new Promise((resolve, reject) => {
        Papa.parse(primaryFile, {
          header: true,
          complete: resolve,
          error: reject
        });
      });

      // Parse secondary file
      const secondaryResult = await new Promise((resolve, reject) => {
        Papa.parse(secondaryFile, {
          header: true,
          complete: resolve,
          error: reject
        });
      });

      // Store the parsed data in sessionStorage
      sessionStorage.setItem('primaryData', JSON.stringify(primaryResult.data));
      sessionStorage.setItem('primaryHeaders', JSON.stringify(primaryResult.meta.fields));
      sessionStorage.setItem('secondaryData', JSON.stringify(secondaryResult.data));
      sessionStorage.setItem('secondaryHeaders', JSON.stringify(secondaryResult.meta.fields));

      // Notify parent component that files are uploaded and processed
      onFilesUploaded(primaryFile, secondaryFile);
    } catch (error) {
      console.error('Error processing files:', error);
      setError('Error processing files. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>

      <div className={styles.filesContainer}>
        <div className={styles.fileUploadSection}>
          <h2 className={styles.sectionTitle}>Primary File (Your main leads file)</h2>
          {!primaryFile ? (
            <div
              {...getPrimaryRootProps()}
              className={`${styles.dropzone} ${isPrimaryDragActive ? styles.active : ''}`}
            >
              <input {...getPrimaryInputProps()} />
              {isPrimaryDragActive ? (
                <p>Drop the CSV file here...</p>
              ) : (
                <div>
                  <p>Drag & drop a CSV file here, or click to select a file</p>
                  <p className={styles.supportedFormats}>Supported format: .csv</p>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.fileCard}>
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{primaryFile.name}</span>
                <span className={styles.fileSize}>{formatFileSize(primaryFile.size)}</span>
              </div>
              <button 
                className={styles.removeButton}
                onClick={handleRemovePrimary}
                title="Remove file"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className={styles.fileUploadSection}>
          <h2 className={styles.sectionTitle}>Secondary File (File to check against)</h2>
          {!secondaryFile ? (
            <div
              {...getSecondaryRootProps()}
              className={`${styles.dropzone} ${isSecondaryDragActive ? styles.active : ''}`}
            >
              <input {...getSecondaryInputProps()} />
              {isSecondaryDragActive ? (
                <p>Drop the CSV file here...</p>
              ) : (
                <div>
                  <p>Drag & drop a CSV file here, or click to select a file</p>
                  <p className={styles.supportedFormats}>Supported format: .csv</p>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.fileCard}>
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{secondaryFile.name}</span>
                <span className={styles.fileSize}>{formatFileSize(secondaryFile.size)}</span>
              </div>
              <button 
                className={styles.removeButton}
                onClick={handleRemoveSecondary}
                title="Remove file"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.actionContainer}>
        <button
          onClick={handleProceed}
          className={styles.proceedButton}
          disabled={!primaryFile || !secondaryFile || isLoading}
        >
          {isLoading ? 'Processing...' : 'Proceed with Cross-Check'}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
