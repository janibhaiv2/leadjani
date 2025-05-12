'use client';

import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import styles from './CrossCheckDetector.module.css';

export default function CrossCheckDetector({ onBackToUpload, primaryFile, secondaryFile }) {
  const [primaryData, setPrimaryData] = useState([]);
  const [secondaryData, setSecondaryData] = useState([]);
  const [primaryHeaders, setPrimaryHeaders] = useState([]);
  const [secondaryHeaders, setSecondaryHeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [duplicates, setDuplicates] = useState([]);
  const [cleanedData, setCleanedData] = useState([]);
  const [selectedDuplicates, setSelectedDuplicates] = useState([]);
  const [comparisonField, setComparisonField] = useState('');
  const [duplicatesDetected, setDuplicatesDetected] = useState(false);
  const [stats, setStats] = useState({
    primaryTotal: 0,
    secondaryTotal: 0,
    duplicatesFound: 0
  });

  useEffect(() => {
    // Get data from sessionStorage
    const storedPrimaryData = sessionStorage.getItem('primaryData');
    const storedPrimaryHeaders = sessionStorage.getItem('primaryHeaders');
    const storedSecondaryData = sessionStorage.getItem('secondaryData');
    const storedSecondaryHeaders = sessionStorage.getItem('secondaryHeaders');

    if (!storedPrimaryData || !storedPrimaryHeaders || !storedSecondaryData || !storedSecondaryHeaders) {
      onBackToUpload();
      return;
    }

    try {
      const parsedPrimaryData = JSON.parse(storedPrimaryData);
      const parsedPrimaryHeaders = JSON.parse(storedPrimaryHeaders);
      const parsedSecondaryData = JSON.parse(storedSecondaryData);
      const parsedSecondaryHeaders = JSON.parse(storedSecondaryHeaders);

      // Add index to each row for identification
      const primaryDataWithIndex = parsedPrimaryData.map((row, index) => ({
        ...row,
        __rowIndex: index
      }));

      setPrimaryData(primaryDataWithIndex);
      setPrimaryHeaders(parsedPrimaryHeaders);
      setSecondaryData(parsedSecondaryData);
      setSecondaryHeaders(parsedSecondaryHeaders);
      setCleanedData(primaryDataWithIndex);

      // Set initial stats
      setStats({
        primaryTotal: parsedPrimaryData.length,
        secondaryTotal: parsedSecondaryData.length,
        duplicatesFound: 0
      });

      // Find common headers between the two files to use as default comparison field
      const commonHeaders = parsedPrimaryHeaders.filter(header => 
        parsedSecondaryHeaders.includes(header)
      );

      if (commonHeaders.length > 0) {
        setComparisonField(commonHeaders[0]);
      }
    } catch (error) {
      console.error('Error processing stored data:', error);
      setError('Error processing stored data. Please try again.');
      onBackToUpload();
    }
  }, [onBackToUpload]);

  const detectDuplicates = () => {
    if (!comparisonField) {
      setError('Please select a field to compare');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create a map of values from secondary file
      const secondaryValues = new Set();
      secondaryData.forEach(row => {
        const value = row[comparisonField];
        if (value) {
          secondaryValues.add(value);
        }
      });

      // Find duplicates in primary file
      const duplicatesFound = [];
      const nonDuplicates = [];

      primaryData.forEach(row => {
        const value = row[comparisonField];
        if (value && secondaryValues.has(value)) {
          duplicatesFound.push(row);
        } else {
          nonDuplicates.push(row);
        }
      });

      // Update state
      setDuplicates(duplicatesFound);
      setCleanedData(nonDuplicates);
      setSelectedDuplicates(duplicatesFound.map(row => row.__rowIndex));
      setDuplicatesDetected(true);

      // Update stats
      setStats(prev => ({
        ...prev,
        duplicatesFound: duplicatesFound.length
      }));
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
    setSelectedDuplicates(duplicates.map(row => row.__rowIndex));
  };

  const deselectAllDuplicates = () => {
    setSelectedDuplicates([]);
  };

  const downloadCleanedFile = () => {
    if (primaryData.length === 0) {
      setError('No data to download');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Filter out selected duplicates
      const finalData = primaryData.filter(row => !selectedDuplicates.includes(row.__rowIndex));

      // Remove the __rowIndex property from each row
      const cleanData = finalData.map(row => {
        const { __rowIndex, ...rest } = row;
        return rest;
      });

      // Generate CSV
      const csv = Papa.unparse({
        fields: primaryHeaders,
        data: cleanData
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
          rowCount: finalData.length,
          columnCount: primaryHeaders.length,
          duplicatesRemoved: selectedDuplicates.length,
          type: 'cross-check'
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

  const formatFileSize = (size) => {
    if (!size) return 'N/A';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading && primaryData.length === 0) {
    return <div className={styles.loading}>Processing your files...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cross-Check Leads</h1>
      <p className={styles.subtitle}>Compare leads between two files and remove duplicates</p>

      <div className={styles.filesInfo}>
        <div className={styles.fileCard}>
          <h3 className={styles.fileTitle}>Primary File</h3>
          <div className={styles.fileDetails}>
            <p><strong>Name:</strong> {primaryFile?.name || 'N/A'}</p>
            <p><strong>Size:</strong> {primaryFile ? formatFileSize(primaryFile.size) : 'N/A'}</p>
            <p><strong>Leads:</strong> {stats.primaryTotal}</p>
          </div>
        </div>
        <div className={styles.fileCard}>
          <h3 className={styles.fileTitle}>Secondary File</h3>
          <div className={styles.fileDetails}>
            <p><strong>Name:</strong> {secondaryFile?.name || 'N/A'}</p>
            <p><strong>Size:</strong> {secondaryFile ? formatFileSize(secondaryFile.size) : 'N/A'}</p>
            <p><strong>Leads:</strong> {stats.secondaryTotal}</p>
          </div>
        </div>
      </div>

      {!duplicatesDetected ? (
        <div className={styles.controlsContainer}>
          <div className={styles.controlGroup}>
            <label htmlFor="comparisonField" className={styles.label}>
              Compare leads based on:
            </label>
            <select
              id="comparisonField"
              className={styles.select}
              value={comparisonField}
              onChange={(e) => setComparisonField(e.target.value)}
            >
              <option value="">Select a field</option>
              {primaryHeaders.filter(header => secondaryHeaders.includes(header)).map((header) => (
                <option key={header} value={header}>
                  {header}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={detectDuplicates}
            className={styles.actionButton}
            disabled={isLoading || !comparisonField}
          >
            {isLoading ? 'Processing...' : 'Detect Duplicates'}
          </button>
        </div>
      ) : (
        <div className={styles.resultsContainer}>
          <div className={styles.resultsHeader}>
            <h2 className={styles.sectionTitle}>Results</h2>
            <div className={styles.statsDisplay}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Duplicates Found:</span>
                <span className={styles.statValue}>{stats.duplicatesFound}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Selected to Remove:</span>
                <span className={styles.statValue}>{selectedDuplicates.length}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Remaining Leads:</span>
                <span className={styles.statValue}>{stats.primaryTotal - selectedDuplicates.length}</span>
              </div>
            </div>
          </div>

          {duplicates.length > 0 && (
            <div className={styles.duplicateActions}>
              <div className={styles.selectionInfo}>
                <span className={styles.selectionCount}>
                  {selectedDuplicates.length} of {duplicates.length} duplicates selected for removal
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
                </div>
              </div>
            </div>
          )}

          <div className={styles.tableContainer}>
            {duplicates.length > 0 ? (
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th className={styles.checkboxColumn}>
                      <input 
                        type="checkbox" 
                        checked={selectedDuplicates.length === duplicates.length && duplicates.length > 0}
                        onChange={e => e.target.checked ? selectAllDuplicates() : deselectAllDuplicates()}
                      />
                    </th>
                    {primaryHeaders.map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {duplicates.map((row, rowIndex) => (
                    <tr key={rowIndex} className={selectedDuplicates.includes(row.__rowIndex) ? styles.selectedRow : ''}>
                      <td className={styles.checkboxColumn}>
                        <input 
                          type="checkbox" 
                          checked={selectedDuplicates.includes(row.__rowIndex)}
                          onChange={() => toggleDuplicateSelection(row.__rowIndex)}
                        />
                      </td>
                      {primaryHeaders.map((header) => (
                        <td key={`${rowIndex}-${header}`}>{row[header] || '-'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className={styles.emptyMessage}>
                No duplicates found between the files.
              </p>
            )}
          </div>
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.buttonContainer}>
        <button
          onClick={onBackToUpload}
          className={styles.backButton}
        >
          Back to Upload
        </button>
        {duplicatesDetected && (
          <button
            onClick={downloadCleanedFile}
            className={styles.proceedButton}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Download Cleaned File'}
          </button>
        )}
      </div>
    </div>
  );
}
