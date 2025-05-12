'use client';

import { useState } from 'react';
import MultiFileUpload from '../components/MultiFileUpload';
import DuplicateDetector from '../components/DuplicateDetector';
import MainLayout from '../components/MainLayout';
import styles from './page.module.css';
import Papa from 'papaparse';

// Metadata is defined in layout.js since this is a client component

export default function DuplicateDetectionPage() {
  const [csvUploaded, setCsvUploaded] = useState(false);

  const handleFilesUploaded = async (files) => {
    try {
      // Process all files and merge their data
      const allData = [];
      let headers = [];

      // Parse each file
      for (const file of files) {
        const result = await new Promise((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            complete: resolve,
            error: reject
          });
        });

        // Add data from this file
        if (result.data && result.data.length > 0) {
          allData.push(...result.data);
          
          // Collect all unique headers
          result.meta.fields.forEach(header => {
            if (!headers.includes(header)) {
              headers.push(header);
            }
          });
        }
      }

      // Store the merged data in sessionStorage
      sessionStorage.setItem('csvData', JSON.stringify(allData));
      sessionStorage.setItem('csvHeaders', JSON.stringify(headers));
      sessionStorage.setItem('fileDetails', JSON.stringify(files.map(file => ({
        name: file.name,
        size: file.size,
        rows: 0, // Will be updated in DuplicateDetector
        columns: 0 // Will be updated in DuplicateDetector
      }))));

      setCsvUploaded(true);
    } catch (error) {
      console.error('Error processing files:', error);
    }
  };

  const handleBackToUpload = () => {
    setCsvUploaded(false);
    // Clear session storage
    sessionStorage.removeItem('csvData');
    sessionStorage.removeItem('csvHeaders');
    sessionStorage.removeItem('fileDetails');
  };

  return (
    <MainLayout>
      <div className="container">
        {!csvUploaded ? (
          <div className={styles.uploadContainer}>
            <MultiFileUpload
              onFilesUploaded={handleFilesUploaded}
              title="Duplicate Detection"
              subtitle="Upload multiple CSV files to detect and remove duplicate leads"
            />
          </div>
        ) : (
          <DuplicateDetector onBackToUpload={handleBackToUpload} />
        )}
      </div>
    </MainLayout>
  );
}
