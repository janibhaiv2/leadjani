'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import styles from './FileUpload.module.css';

export default function FileUpload({
  onCsvUploaded,
  title = "Filter Leads",
  subtitle = "Upload your CSV file to process"
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback(acceptedFiles => {
    setIsLoading(true);
    setError(null);

    const file = acceptedFiles[0];

    if (file && file.type === 'text/csv') {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            // Store the parsed data in sessionStorage
            sessionStorage.setItem('csvData', JSON.stringify(results.data));
            sessionStorage.setItem('csvHeaders', JSON.stringify(results.meta.fields));

            // Notify parent component that CSV is uploaded
            onCsvUploaded();
          } else {
            setError('The CSV file appears to be empty or invalid.');
          }
          setIsLoading(false);
        },
        error: (error) => {
          setError(`Error parsing CSV: ${error.message}`);
          setIsLoading(false);
        }
      });
    } else {
      setError('Please upload a valid CSV file.');
      setIsLoading(false);
    }
  }, [onCsvUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false
  });

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
          <p>Drop the CSV file here...</p>
        ) : (
          <div>
            <p>Drag & drop a CSV file here, or click to select a file</p>
            <p className={styles.supportedFormats}>Supported format: .csv</p>
          </div>
        )}
      </div>

      {isLoading && <p className={styles.loading}>Processing your file...</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
