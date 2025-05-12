'use client';

import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import FilterEditor from '../components/FilterEditor';
import MainLayout from '../components/MainLayout';
import styles from './page.module.css';

// Metadata is defined in layout.js since this is a client component

export default function AdvancedFilterPage() {
  const [csvUploaded, setCsvUploaded] = useState(false);

  const handleCsvUploaded = () => {
    setCsvUploaded(true);
  };

  const handleBackToUpload = () => {
    setCsvUploaded(false);
    // Clear session storage
    sessionStorage.removeItem('csvData');
    sessionStorage.removeItem('csvHeaders');
  };

  return (
    <MainLayout>
      <div className="container">
        {!csvUploaded ? (
          <div className={styles.uploadContainer}>
            <FileUpload
              onCsvUploaded={handleCsvUploaded}
              title="Advanced Filter"
              subtitle="Upload your CSV file to filter leads"
            />
          </div>
        ) : (
          <FilterEditor onBackToUpload={handleBackToUpload} />
        )}
      </div>
    </MainLayout>
  );
}
