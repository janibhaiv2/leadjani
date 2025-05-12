'use client';

import { useState } from 'react';
import FileUpload from './FileUpload';
import HeaderEditor from './HeaderEditor';
import styles from './CSVProcessor.module.css';

export default function CSVProcessor() {
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
    <div className={styles.processorContainer}>
      {!csvUploaded ? (
        <FileUpload onCsvUploaded={handleCsvUploaded} />
      ) : (
        <HeaderEditor onBackToUpload={handleBackToUpload} />
      )}
    </div>
  );
}
