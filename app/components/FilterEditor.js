'use client';

import { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import styles from './FilterEditor.module.css';

export default function FilterEditor({ onBackToUpload }) {
  const [headers, setHeaders] = useState([]);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uniqueValues, setUniqueValues] = useState({});
  const [quickFilters, setQuickFilters] = useState([]);
  const [showTable, setShowTable] = useState(false);
  // Removed pagination state

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
    setFilteredData(parsedData);

    // Get unique values for each column for filter dropdowns
    const uniqueValuesObj = {};
    parsedHeaders.forEach(header => {
      const values = new Set();
      parsedData.forEach(row => {
        if (row[header]) {
          values.add(row[header]);
        }
      });
      uniqueValuesObj[header] = Array.from(values).sort();
    });
    setUniqueValues(uniqueValuesObj);

    // Set initial quick filter (prefer nationality if it exists)
    const nationalityHeader = parsedHeaders.find(header =>
      header.toLowerCase().includes('nationality') ||
      header.toLowerCase().includes('country')
    );

    if (nationalityHeader) {
      setQuickFilters([{
        id: Date.now(),
        column: nationalityHeader,
        values: []
      }]);
    } else if (parsedHeaders.length > 0) {
      setQuickFilters([{
        id: Date.now(),
        column: parsedHeaders[0],
        values: []
      }]);
    }
  }, [onBackToUpload]);

  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowColumnDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const addQuickFilter = (column) => {
    if (headers.length === 0) return;

    setQuickFilters([
      ...quickFilters,
      {
        id: Date.now(),
        column: column,
        values: []
      }
    ]);

    setShowColumnDropdown(false);
  };

  const toggleColumnDropdown = () => {
    setShowColumnDropdown(!showColumnDropdown);
  };

  const removeQuickFilter = (filterId) => {
    // Don't allow removing the last filter
    if (quickFilters.length <= 1) {
      return;
    }

    const updatedFilters = quickFilters.filter(filter => filter.id !== filterId);
    setQuickFilters(updatedFilters);
    applyQuickFilters(updatedFilters);
  };

  const updateQuickFilterColumn = (filterId, column) => {
    const updatedFilters = quickFilters.map(filter => {
      if (filter.id === filterId) {
        return {
          ...filter,
          column,
          values: [] // Reset values when column changes
        };
      }
      return filter;
    });

    setQuickFilters(updatedFilters);
    // Apply filters automatically
    applyQuickFilters(updatedFilters);
  };

  const addValueToQuickFilter = (filterId, value) => {
    const updatedFilters = quickFilters.map(filter => {
      if (filter.id === filterId && !filter.values.includes(value)) {
        return {
          ...filter,
          values: [...filter.values, value]
        };
      }
      return filter;
    });

    setQuickFilters(updatedFilters);
    // Apply filters automatically
    applyQuickFilters(updatedFilters);
  };

  const removeValueFromQuickFilter = (filterId, value) => {
    const updatedFilters = quickFilters.map(filter => {
      if (filter.id === filterId) {
        return {
          ...filter,
          values: filter.values.filter(v => v !== value)
        };
      }
      return filter;
    });

    setQuickFilters(updatedFilters);
    // Apply filters automatically
    applyQuickFilters(updatedFilters);
  };

  const applyQuickFilters = (currentFilters = quickFilters) => {
    // If no filters have values selected, show all data
    const activeFilters = currentFilters.filter(filter => filter.values.length > 0);

    if (activeFilters.length === 0) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter(row => {
      return activeFilters.every(filter => {
        const cellValue = row[filter.column];
        return cellValue && filter.values.includes(cellValue);
      });
    });

    setFilteredData(filtered);

    // Apply filters immediately
  };

  const toggleTableView = () => {
    setShowTable(!showTable);
  };

  const downloadFilteredData = () => {
    if (filteredData.length === 0) {
      setError('No data to download');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Generate CSV
      const csv = Papa.unparse(filteredData);

      // Create download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'filtered_leads.csv');
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
          rowCount: filteredData.length,
          columnCount: headers.length,
          filtersCount: filters.length,
          type: 'filter'
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

  if (headers.length === 0) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Filter Leads</h1>
      <p className={styles.subtitle}>Filter your leads by any criteria and download the results</p>

      <div className={styles.statsCard}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Total Leads:</span>
          <span className={styles.statValue}>{data.length}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Filtered Leads:</span>
          <span className={styles.statValue}>{filteredData.length}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Active Filters:</span>
          <span className={styles.statValue}>{quickFilters.filter(f => f.values.length > 0).length}</span>
        </div>
      </div>

      <div className={styles.filtersContainer}>
        <div className={styles.filtersHeader}>
          <h2 className={styles.sectionTitle}>Filters</h2>
          <div className={styles.addFilterWrapper} ref={dropdownRef}>
            <button
              className={styles.addFilterButton}
              onClick={toggleColumnDropdown}
            >
              Add Filter
            </button>

            {showColumnDropdown && (
              <div className={styles.columnDropdown}>
                {headers
                  .filter(header => !quickFilters.some(filter => filter.column === header))
                  .map(header => (
                    <button
                      key={header}
                      className={styles.columnOption}
                      onClick={() => addQuickFilter(header)}
                    >
                      {header}
                    </button>
                  ))}

                {headers.filter(header => !quickFilters.some(filter => filter.column === header)).length === 0 && (
                  <div className={styles.noColumns}>All columns are already being filtered</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={styles.filtersIntro}>
          <strong>How to filter:</strong> Click "Add Filter" to select a column, then check the values you want to include.
          You can add multiple filters to narrow down your results. All filters will be applied together.
        </div>

        <div className={styles.quickFiltersList}>
          {quickFilters.map(filter => (
            <div key={filter.id} className={styles.quickFilterCard}>
              <div className={styles.quickFilterHeader}>
                <h3 className={styles.filterTitle}>{filter.column}</h3>
                {quickFilters.length > 1 && (
                  <button
                    className={styles.removeFilterButton}
                    onClick={() => removeQuickFilter(filter.id)}
                    title="Remove filter"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className={styles.quickFilterValues}>
                <div className={styles.radioContainer}>
                  {uniqueValues[filter.column]?.slice(0, 20).map(value => (
                    <div key={value} className={styles.radioOption}>
                      <input
                        type="checkbox"
                        id={`${filter.id}-${value}`}
                        checked={filter.values.includes(value)}
                        onChange={() => {
                          if (filter.values.includes(value)) {
                            removeValueFromQuickFilter(filter.id, value);
                          } else {
                            addValueToQuickFilter(filter.id, value);
                          }
                        }}
                        className={styles.radioInput}
                      />
                      <label
                        htmlFor={`${filter.id}-${value}`}
                        className={styles.radioLabel}
                      >
                        {value}
                      </label>
                    </div>
                  ))}

                  {uniqueValues[filter.column]?.length > 20 && (
                    <div className={styles.moreValues}>
                      + {uniqueValues[filter.column].length - 20} more values
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.dataViewContainer}>
        <div className={styles.dataViewHeader}>
          <h2 className={styles.sectionTitle}>Filtered Leads</h2>
          <button
            className={styles.viewToggleButton}
            onClick={toggleTableView}
          >
            {showTable ? 'Hide Table' : 'Show Table'}
          </button>
        </div>

        {showTable && (
          <div className={styles.tableWrapper}>
            <div className={styles.tableControls}>
              <div className={styles.paginationInfo}>
                Showing all {filteredData.length} leads
              </div>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    {headers.map(header => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {headers.map(header => (
                        <td key={`${rowIndex}-${header}`}>{row[header] || ''}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
          onClick={downloadFilteredData}
          className={styles.proceedButton}
          disabled={filteredData.length === 0 || isLoading}
        >
          {isLoading ? 'Processing...' : 'Download Filtered Data'}
        </button>
      </div>
    </div>
  );
}
