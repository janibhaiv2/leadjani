'use client';

import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import MergeEditor from '../components/MergeEditor';
import MainLayout from '../components/MainLayout';
import styles from './page.module.css';

// Metadata is defined in layout.js since this is a client component

export default function MergeLeadsPage() {
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
              title="Merge Leads"
              subtitle="Upload your CSV file to merge leads"
            />
          </div>
        ) : (
          <MergeEditor onBackToUpload={handleBackToUpload} />
        )}
      </div>
    </MainLayout>
  );
}
