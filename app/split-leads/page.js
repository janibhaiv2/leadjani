'use client';

import { useState } from 'react';
import SplitEditor from '../components/SplitEditor';
import FileUpload from '../components/FileUpload';
import MainLayout from '../components/MainLayout';
import styles from './page.module.css';

// Metadata is defined in layout.js since this is a client component

export default function SplitLeadsPage() {
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
              title="Split Leads"
              subtitle="Upload your CSV file to split leads among users"
            />
          </div>
        ) : (
          <SplitEditor onBackToUpload={handleBackToUpload} />
        )}
      </div>
    </MainLayout>
  );
}
