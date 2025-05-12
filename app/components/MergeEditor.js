'use client';

import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import styles from './MergeEditor.module.css';

export default function MergeEditor({ onBackToUpload }) {
  const [mergedData, setMergedData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileDetails, setFileDetails] = useState([]);

  useEffect(() => {
    // Get data from sessionStorage
    const storedData = sessionStorage.getItem('csvData');
    const storedHeaders = sessionStorage.getItem('csvHeaders');
    const storedFileDetails = sessionStorage.getItem('fileDetails');

    if (!storedData || !storedHeaders) {
      onBackToUpload();
      return;
    }

    const processFiles = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const parsedData = JSON.parse(storedData);
        const parsedHeaders = JSON.parse(storedHeaders);

        // Process file details
        let fileInfo = [];
        if (storedFileDetails) {
          // Use stored file details if available
          fileInfo = JSON.parse(storedFileDetails).map(file => ({
            ...file,
            size: formatFileSize(file.size),
            rows: parsedData.length, // This is approximate as we've merged the data
            columns: parsedHeaders.length
          }));
        } else {
          // Fallback to a single file entry if no file details are stored
          fileInfo = [{
            name: "Merged CSV",
            size: "N/A",
            rows: parsedData.length,
            columns: parsedHeaders.length
          }];
        }

        setFileDetails(fileInfo);

        // Use the data directly
        setHeaders(parsedHeaders);
        setMergedData(parsedData);
      } catch (error) {
        console.error('Error processing files:', error);
        setError('Error processing files. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    processFiles();
  }, [onBackToUpload]);

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0 || !bytes) return 'N/A';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processAndDownload = () => {
    if (mergedData.length === 0) {
      setError('No data to download');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Generate CSV
      const csv = Papa.unparse({
        fields: headers,
        data: mergedData
      });

      // Create download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'merged_leads.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Save processing history to localStorage
      try {
        const history = localStorage.getItem('csvProcessingHistory');
        let processingHistory = [];

        if (history) {
          processingHistory = JSON.parse(history);
        }

        // Add new entry
        processingHistory.push({
          date: new Date().toISOString(),
          rowCount: mergedData.length,
          columnCount: headers.length,
          filesCount: fileDetails.length,
          type: 'merge'
        });

        // Keep only the last 10 entries
        if (processingHistory.length > 10) {
          processingHistory = processingHistory.slice(-10);
        }

        localStorage.setItem('csvProcessingHistory', JSON.stringify(processingHistory));
      } catch (error) {
        console.error('Error saving processing history:', error);
      }
    } catch (error) {
      console.error('Error creating CSV file:', error);
      setError('Error creating CSV file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && mergedData.length === 0) {
    return <div className={styles.loading}>Processing your files...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Merge Leads</h1>
      <p className={styles.subtitle}>Combine multiple CSV files into a single file</p>

      <div className={styles.statsCard}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Total Files:</span>
          <span className={styles.statValue}>{fileDetails.length}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Total Leads:</span>
          <span className={styles.statValue}>{mergedData.length}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Total Columns:</span>
          <span className={styles.statValue}>{headers.length}</span>
        </div>
      </div>

      <div className={styles.filesContainer}>
        <h2 className={styles.sectionTitle}>Files</h2>
        {fileDetails.length === 0 ? (
          <p className={styles.emptyMessage}>No files added yet.</p>
        ) : (
          <div className={styles.filesList}>
            {fileDetails.map((file, index) => (
              <div key={index} className={styles.fileCard}>
                <div className={styles.fileInfo}>
                  <span className={styles.fileName}>{file.name}</span>
                  <span className={styles.fileStats}>
                    {file.rows} leads • {file.columns} columns • {file.size}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.buttonContainer}>
        <button
          onClick={onBackToUpload}
          className={styles.backButton}
        >
          Back to Upload
        </button>
        <button
          onClick={processAndDownload}
          className={styles.proceedButton}
          disabled={mergedData.length === 0 || isLoading}
        >
          {isLoading ? 'Processing...' : 'Merge and Download'}
        </button>
      </div>
    </div>
  );
}
