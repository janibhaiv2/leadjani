'use client';

import { useState } from 'react';
import CrossCheckUpload from '../components/CrossCheckUpload';
import CrossCheckDetector from '../components/CrossCheckDetector';
import MainLayout from '../components/MainLayout';
import styles from './page.module.css';

export default function CrossCheckPage() {
  const [filesUploaded, setFilesUploaded] = useState(false);
  const [primaryFile, setPrimaryFile] = useState(null);
  const [secondaryFile, setSecondaryFile] = useState(null);

  const handleFilesUploaded = (primary, secondary) => {
    setPrimaryFile(primary);
    setSecondaryFile(secondary);
    setFilesUploaded(true);
  };

  const handleBackToUpload = () => {
    setFilesUploaded(false);
    setPrimaryFile(null);
    setSecondaryFile(null);
    // Clear session storage
    sessionStorage.removeItem('primaryData');
    sessionStorage.removeItem('primaryHeaders');
    sessionStorage.removeItem('secondaryData');
    sessionStorage.removeItem('secondaryHeaders');
  };

  return (
    <MainLayout>
      <div className="container">
        {!filesUploaded ? (
          <div className={styles.uploadContainer}>
            <CrossCheckUpload
              onFilesUploaded={handleFilesUploaded}
              title="Cross-Check Leads"
              subtitle="Upload two CSV files to check for duplicates between them"
            />
          </div>
        ) : (
          <CrossCheckDetector 
            onBackToUpload={handleBackToUpload}
            primaryFile={primaryFile}
            secondaryFile={secondaryFile}
          />
        )}
      </div>
    </MainLayout>
  );
}
