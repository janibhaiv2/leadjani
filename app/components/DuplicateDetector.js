'use client';

import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import styles from './DuplicateDetector.module.css';

export default function DuplicateDetector({ onBackToUpload }) {
  const [mergedData, setMergedData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileDetails, setFileDetails] = useState([]);
  const [duplicateCheckField, setDuplicateCheckField] = useState('');
  const [duplicates, setDuplicates] = useState([]);
  const [uniqueData, setUniqueData] = useState([]);
  const [duplicateStats, setDuplicateStats] = useState({
    total: 0,
    unique: 0,
    duplicates: 0
  });
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [selectedDuplicates, setSelectedDuplicates] = useState([]);

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

        // Set default duplicate check field to the first header
        if (parsedHeaders.length > 0 && !duplicateCheckField) {
          setDuplicateCheckField(parsedHeaders[0]);
        }

        // Set initial stats
        setDuplicateStats({
          total: parsedData.length,
          unique: parsedData.length,
          duplicates: 0
        });
      } catch (error) {
        console.error('Error processing files:', error);
        setError('Error processing files. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    processFiles();
  }, [onBackToUpload, duplicateCheckField]);

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0 || !bytes) return 'N/A';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const detectDuplicates = () => {
    if (!duplicateCheckField || mergedData.length === 0) {
      setError('Please select a field to check for duplicates');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create a map to track duplicates
      const uniqueMap = new Map();
      const duplicatesArray = [];
      const uniqueArray = [];

      // Process each row
      mergedData.forEach((row, index) => {
        // Add an index to each row for identification
        const rowWithIndex = { ...row, __rowIndex: index };
        const value = row[duplicateCheckField];

        // Skip empty values
        if (!value) {
          uniqueArray.push(rowWithIndex);
          return;
        }

        if (uniqueMap.has(value)) {
          // This is a duplicate
          duplicatesArray.push(rowWithIndex);
          uniqueMap.get(value).count += 1;
        } else {
          // This is a new unique value
          uniqueMap.set(value, { row: rowWithIndex, count: 1 });
          uniqueArray.push(rowWithIndex);
        }
      });

      // Reset selected duplicates
      setSelectedDuplicates([]);

      // Update state with results
      setDuplicates(duplicatesArray);
      setUniqueData(uniqueArray);
      setDuplicateStats({
        total: mergedData.length,
        unique: uniqueArray.length,
        duplicates: duplicatesArray.length
      });
    } catch (error) {
      console.error('Error detecting duplicates:', error);
      setError('Error detecting duplicates. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDuplicateSelection = (rowIndex) => {
    setSelectedDuplicates(prev => {
      if (prev.includes(rowIndex)) {
        return prev.filter(index => index !== rowIndex);
      } else {
        return [...prev, rowIndex];
      }
    });
  };

  const selectAllDuplicates = () => {
    const allDuplicateIndices = duplicates.map(row => row.__rowIndex);
    setSelectedDuplicates(allDuplicateIndices);
  };

  const deselectAllDuplicates = () => {
    setSelectedDuplicates([]);
  };

  const removeDuplicates = () => {
    if (selectedDuplicates.length === 0) {
      setError('Please select at least one duplicate to remove');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Filter out selected duplicates from merged data
      const updatedData = mergedData.filter((_, index) => !selectedDuplicates.includes(index));

      // Update session storage with cleaned data
      sessionStorage.setItem('csvData', JSON.stringify(updatedData));

      // Reset the component with new data
      setMergedData(updatedData);
      setDuplicates([]);
      setUniqueData([]);
      setSelectedDuplicates([]);

      // Update stats
      setDuplicateStats({
        total: updatedData.length,
        unique: updatedData.length,
        duplicates: 0
      });

      // Show success message
      setError(`Successfully removed ${selectedDuplicates.length} duplicate leads.`);
    } catch (error) {
      console.error('Error removing duplicates:', error);
      setError('Error removing duplicates. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCleanedData = () => {
    if (uniqueData.length === 0) {
      setError('No data to download');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Generate CSV
      const csv = Papa.unparse({
        fields: headers,
        data: uniqueData
      });

      // Create download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'cleaned_leads.csv');
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
          rowCount: uniqueData.length,
          columnCount: headers.length,
          filesCount: fileDetails.length,
          type: 'duplicate-removal',
          duplicatesRemoved: duplicateStats.duplicates
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
      <h1 className={styles.title}>Duplicate Detection</h1>
      <p className={styles.subtitle}>Detect and remove duplicate leads from multiple files</p>

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
          <span className={styles.statLabel}>Duplicate Leads:</span>
          <span className={styles.statValue}>{duplicateStats.duplicates}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Unique Leads:</span>
          <span className={styles.statValue}>{duplicateStats.unique}</span>
        </div>
      </div>

      <div className={styles.controlsContainer}>
        <div className={styles.controlGroup}>
          <label htmlFor="duplicateField" className={styles.label}>
            Check for duplicates based on:
          </label>
          <select
            id="duplicateField"
            className={styles.select}
            value={duplicateCheckField}
            onChange={(e) => setDuplicateCheckField(e.target.value)}
          >
            {headers.map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={detectDuplicates}
          className={styles.actionButton}
          disabled={isLoading || !duplicateCheckField}
        >
          {isLoading ? 'Processing...' : 'Detect Duplicates'}
        </button>
      </div>

      {duplicates.length > 0 && (
        <div className={styles.resultsContainer}>
          <div className={styles.resultsHeader}>
            <h2 className={styles.sectionTitle}>Results</h2>
            <div className={styles.toggleContainer}>
              <button
                className={`${styles.toggleButton} ${!showDuplicates ? styles.active : ''}`}
                onClick={() => setShowDuplicates(false)}
              >
                Unique Leads ({duplicateStats.unique})
              </button>
              <button
                className={`${styles.toggleButton} ${showDuplicates ? styles.active : ''}`}
                onClick={() => setShowDuplicates(true)}
              >
                Duplicate Leads ({duplicateStats.duplicates})
              </button>
            </div>
          </div>

          {showDuplicates && duplicates.length > 0 && (
            <div className={styles.duplicateActions}>
              <div className={styles.selectionInfo}>
                <span className={styles.selectionCount}>
                  {selectedDuplicates.length} of {duplicates.length} duplicates selected
                </span>
                <div className={styles.selectionButtons}>
                  <button
                    className={styles.selectButton}
                    onClick={selectAllDuplicates}
                  >
                    Select All
                  </button>
                  <button
                    className={styles.selectButton}
                    onClick={deselectAllDuplicates}
                    disabled={selectedDuplicates.length === 0}
                  >
                    Deselect All
                  </button>
                  <button
                    className={styles.removeButton}
                    onClick={removeDuplicates}
                    disabled={selectedDuplicates.length === 0}
                  >
                    Remove Selected
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className={styles.tableContainer}>
            {(showDuplicates ? duplicates : uniqueData).length > 0 ? (
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    {showDuplicates && (
                      <th className={styles.checkboxColumn}>
                        <input
                          type="checkbox"
                          checked={selectedDuplicates.length === duplicates.length && duplicates.length > 0}
                          onChange={e => e.target.checked ? selectAllDuplicates() : deselectAllDuplicates()}
                        />
                      </th>
                    )}
                    {headers.map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(showDuplicates ? duplicates : uniqueData).map((row, rowIndex) => (
                    <tr key={rowIndex} className={selectedDuplicates.includes(row.__rowIndex) ? styles.selectedRow : ''}>
                      {showDuplicates && (
                        <td className={styles.checkboxColumn}>
                          <input
                            type="checkbox"
                            checked={selectedDuplicates.includes(row.__rowIndex)}
                            onChange={() => toggleDuplicateSelection(row.__rowIndex)}
                          />
                        </td>
                      )}
                      {headers.map((header) => (
                        <td key={`${rowIndex}-${header}`}>{row[header] || '-'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className={styles.emptyMessage}>
                No {showDuplicates ? 'duplicate' : 'unique'} leads found.
              </p>
            )}
          </div>
        </div>
      )}

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
          onClick={downloadCleanedData}
          className={styles.proceedButton}
          disabled={uniqueData.length === 0 || isLoading}
        >
          {isLoading ? 'Processing...' : 'Download Cleaned Data'}
        </button>
      </div>
    </div>
  );
}
