'use client';

import { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import styles from './HeaderEditor.module.css';
import { isPhoneNumberColumn, formatPhoneNumber } from '../utils/phoneUtils';

export default function HeaderEditor({ onBackToUpload }) {
  const [headers, setHeaders] = useState([]);
  const [data, setData] = useState([]);
  const [editedHeaders, setEditedHeaders] = useState([]);
  const [phoneOptions, setPhoneOptions] = useState({});
  const [phoneColumns, setPhoneColumns] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  useEffect(() => {
    // Get data from sessionStorage
    const storedHeaders = sessionStorage.getItem('csvHeaders');
    const storedData = sessionStorage.getItem('csvData');

    if (!storedHeaders || !storedData) {
      // If no data is found, go back to upload
      onBackToUpload();
      return;
    }

    const parsedHeaders = JSON.parse(storedHeaders);
    const parsedData = JSON.parse(storedData);

    setHeaders(parsedHeaders);
    setData(parsedData);

    // Initialize edited headers with original headers
    setEditedHeaders(parsedHeaders.map(header => ({
      original: header,
      edited: header,
      include: true
    })));

    // Detect phone number columns
    const detectedPhoneColumns = parsedHeaders.filter(header =>
      isPhoneNumberColumn(header)
    );
    setPhoneColumns(detectedPhoneColumns);

    // Initialize phone options for all headers (default: 'keep')
    const initialPhoneOptions = {};
    parsedHeaders.forEach(header => {
      initialPhoneOptions[header] = 'keep';
    });
    setPhoneOptions(initialPhoneOptions);

    // Set preview data (first 3 rows)
    setPreviewData(parsedData.slice(0, 3));
  }, [onBackToUpload]);

  const handleHeaderChange = (index, value) => {
    const newEditedHeaders = [...editedHeaders];
    newEditedHeaders[index].edited = value;
    setEditedHeaders(newEditedHeaders);
  };

  const handleDeleteColumn = (index) => {
    const newEditedHeaders = [...editedHeaders];
    newEditedHeaders[index].include = false;
    setEditedHeaders(newEditedHeaders);
  };

  const handlePhoneOptionChange = (header, option) => {
    setPhoneOptions({
      ...phoneOptions,
      [header]: option
    });
  };

  // Drag and drop handlers
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      return;
    }

    // Create a copy of the editedHeaders array
    const newEditedHeaders = [...editedHeaders];

    // Remove the dragged item
    const draggedItem = newEditedHeaders.splice(draggedIndex, 1)[0];

    // Insert the dragged item at the drop position
    newEditedHeaders.splice(dropIndex, 0, draggedItem);

    // Update the state
    setEditedHeaders(newEditedHeaders);

    // Reset drag states
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const processAndDownload = () => {
    // Filter out headers that are not included
    const includedHeaders = editedHeaders.filter(header => header.include);

    // Create a mapping from original to edited headers
    const headerMap = {};
    includedHeaders.forEach(header => {
      headerMap[header.original] = header.edited;
    });

    // Process the data
    const processedData = data.map(row => {
      const newRow = {};

      // Only include columns that are not deleted
      includedHeaders.forEach(header => {
        const originalHeader = header.original;
        const newHeader = header.edited;
        let value = row[originalHeader];

        // Apply phone number formatting if applicable
        if (phoneColumns.includes(originalHeader) && phoneOptions[originalHeader] === 'format' && value) {
          value = formatPhoneNumber(value);
        }

        newRow[newHeader] = value;
      });

      return newRow;
    });

    // Generate CSV
    const csv = Papa.unparse(processedData);

    // Create a download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'processed_data.csv');
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
        rowCount: processedData.length,
        columnCount: includedHeaders.length,
        phoneColumnsFormatted: phoneColumns.filter(col => phoneOptions[col] === 'format').length
      });

      // Keep only the last 10 entries
      if (processingHistory.length > 10) {
        processingHistory = processingHistory.slice(-10);
      }

      localStorage.setItem('csvProcessingHistory', JSON.stringify(processingHistory));
    } catch (error) {
      console.error('Error saving processing history:', error);
    }
  };

  // Preview the formatted phone number
  const getPhonePreview = (header, value) => {
    if (!value) return '';
    if (phoneOptions[header] === 'keep') return value;
    if (phoneOptions[header] === 'format') return formatPhoneNumber(value);
    return value;
  };

  if (headers.length === 0) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Edit CSV Headers</h1>
      <p className={styles.subtitle}>Customize your headers and format phone numbers</p>

      <div className={styles.instructionContainer}>
        <div className={styles.instruction}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M12 5L6 11M12 5L18 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Drag rows to reorder columns in your CSV</span>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.headerTable}>
          <thead>
            <tr>
              <th></th>
              <th>Original Header</th>
              <th>New Header</th>
              <th>Actions</th>
              {/* Only show Phone Format column for phone number columns */}
              {phoneColumns.length > 0 && <th>Phone Format</th>}
            </tr>
          </thead>
          <tbody>
            {editedHeaders.map((header, index) => (
              <tr
                key={index}
                className={`
                  ${header.include ? '' : styles.deleted}
                  ${draggedIndex === index ? styles.dragging : ''}
                  ${dragOverIndex === index ? styles.dragOver : ''}
                `}
                draggable={header.include}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                onDrop={(e) => handleDrop(e, index)}
              >
                <td className={styles.dragHandle}>
                  {header.include && (
                    <div className={styles.dragIcon} title="Drag to reorder">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="9" cy="6" r="2" fill="currentColor"/>
                        <circle cx="9" cy="12" r="2" fill="currentColor"/>
                        <circle cx="9" cy="18" r="2" fill="currentColor"/>
                        <circle cx="15" cy="6" r="2" fill="currentColor"/>
                        <circle cx="15" cy="12" r="2" fill="currentColor"/>
                        <circle cx="15" cy="18" r="2" fill="currentColor"/>
                      </svg>
                    </div>
                  )}
                </td>
                <td>{header.original}</td>
                <td>
                  <input
                    type="text"
                    value={header.edited}
                    onChange={(e) => handleHeaderChange(index, e.target.value)}
                    disabled={!header.include}
                    className={styles.headerInput}
                  />
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteColumn(index)}
                    className={styles.deleteButton}
                    disabled={!header.include}
                    title="Delete column"
                  >
                    🗑️
                  </button>
                </td>
                {/* Only show Phone Format dropdown for phone number columns */}
                {phoneColumns.length > 0 && (
                  <td>
                    {phoneColumns.includes(header.original) ? (
                      <div className={styles.phoneFormatContainer}>
                        <select
                          value={phoneOptions[header.original]}
                          onChange={(e) => handlePhoneOptionChange(header.original, e.target.value)}
                          disabled={!header.include}
                          className={styles.phoneSelect}
                        >
                          <option value="keep">Keep as is</option>
                          <option value="format">Auto-format (International)</option>
                        </select>

                        {/* Show preview of formatted numbers */}
                        {header.include && phoneOptions[header.original] === 'format' && (
                          <div className={styles.previewContainer}>
                            <p className={styles.previewTitle}>Preview of Auto-Formatting:</p>
                            <ul className={styles.previewList}>
                              {previewData.map((row, i) => (
                                row[header.original] && (
                                  <li key={i} className={styles.previewItem}>
                                    <span className={styles.originalValue}>{row[header.original]}</span>
                                    <span className={styles.arrow}>→</span>
                                    <span className={styles.formattedValue}>{getPhonePreview(header.original, row[header.original])}</span>
                                  </li>
                                )
                              )).filter(Boolean).length > 0 ? (
                                previewData.map((row, i) => (
                                  row[header.original] && (
                                    <li key={i} className={styles.previewItem}>
                                      <span className={styles.originalValue}>{row[header.original]}</span>
                                      <span className={styles.arrow}>→</span>
                                      <span className={styles.formattedValue}>{getPhonePreview(header.original, row[header.original])}</span>
                                    </li>
                                  )
                                )).filter(Boolean)
                              ) : (
                                <li className={styles.previewItem}>
                                  <span className={styles.noPreview}>No preview available. Numbers will be formatted based on country code detection.</span>
                                </li>
                              )}
                            </ul>
                            <p className={styles.previewNote}>
                              Auto-formatting intelligently detects country codes and formats numbers according to international standards. Examples:
                            </p>
                            <ul className={styles.examplesList}>
                              <li><span className={styles.exampleInput}>0512345678</span> → <span className={styles.exampleOutput}>+971 51 234 5678</span> (UAE)</li>
                              <li><span className={styles.exampleInput}>03001234567</span> → <span className={styles.exampleOutput}>+92 300 123 4567</span> (Pakistan)</li>
                              <li><span className={styles.exampleInput}>07911123456</span> → <span className={styles.exampleOutput}>+44 7911 123 456</span> (UK)</li>
                              <li><span className={styles.exampleInput}>9876543210</span> → <span className={styles.exampleOutput}>+91 98765 43210</span> (India)</li>
                              <li><span className={styles.exampleInput}>5551234567</span> → <span className={styles.exampleOutput}>+1 (555) 123-4567</span> (US/Canada)</li>
                            </ul>
                            <p className={styles.previewNote}>
                              Already correctly formatted numbers will be preserved.
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className={styles.notApplicable}>N/A</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
        >
          Process and Download
        </button>
      </div>
    </div>
  );
}
