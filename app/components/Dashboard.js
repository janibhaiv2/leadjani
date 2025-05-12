'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [processingHistory, setProcessingHistory] = useState([]);
  const [totalProcessed, setTotalProcessed] = useState(0);

  useEffect(() => {
    // Load processing history from localStorage
    const history = localStorage.getItem('csvProcessingHistory');
    if (history) {
      const parsedHistory = JSON.parse(history);
      setProcessingHistory(parsedHistory);
      setTotalProcessed(parsedHistory.length);
    }
  }, []);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>CULTJANI</h1>
        <p className={styles.subtitle}>Process and format your Meta/Facebook Lead Form data</p>
      </div>

      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={styles.statInfo}>
            <h3 className={styles.statTitle}>Total Processed</h3>
            <p className={styles.statValue}>{totalProcessed}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={styles.statInfo}>
            <h3 className={styles.statTitle}>Last Processed</h3>
            <p className={styles.statValue}>
              {processingHistory.length > 0
                ? new Date(processingHistory[processingHistory.length - 1].date).toLocaleDateString()
                : 'Never'}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.featuresContainer}>
        <h2 className={styles.sectionTitle}>Features</h2>
        <div className={styles.featureCards}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Lead Filtering</h3>
            <p className={styles.featureDescription}>
              Upload your CSV files from Meta/Facebook Lead Forms with drag-and-drop functionality.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Header Editing</h3>
            <p className={styles.featureDescription}>
              Edit column headers, remove unwanted columns, and customize your data structure.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 16.92V19.92C22 20.4504 21.7893 20.9591 21.4142 21.3342C21.0391 21.7093 20.5304 21.92 20 21.92C18.68 21.92 17.37 21.66 16.14 21.15C14.99 20.6791 13.93 20.0122 13 19.17C11.07 17.24 9.53 14.94 8.53 12.44C8.02 11.21 7.76 9.9 7.76 8.58C7.76 8.0496 7.97 7.54087 8.34 7.16581C8.71 6.79074 9.22 6.58 9.75 6.58H12.75C13.1978 6.58 13.6294 6.75901 13.9513 7.08095C14.2732 7.40289 14.4522 7.83458 14.45 8.28C14.45 8.91 14.54 9.52 14.71 10.11C14.8305 10.5087 14.8191 10.9362 14.6784 11.3265C14.5377 11.7168 14.2745 12.0512 13.93 12.28L12.75 13.46C13.5187 15.1428 14.8359 16.4602 16.52 17.23L17.7 16.06C17.9288 15.7155 18.2632 15.4523 18.6535 15.3116C19.0438 15.1709 19.4713 15.1595 19.87 15.28C20.46 15.45 21.07 15.54 21.7 15.54C22.1467 15.5411 22.5786 15.7224 22.9004 16.0462C23.2222 16.3701 23.4 16.8035 23.4 17.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Phone Formatting</h3>
            <p className={styles.featureDescription}>
              Automatically detect and format phone numbers based on country codes and standard formats.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 8V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 11H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Split Leads</h3>
            <p className={styles.featureDescription}>
              Divide your leads evenly among multiple users and download as separate CSV files in a ZIP archive.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.instructionsContainer}>
        <h2 className={styles.sectionTitle}>How to Use</h2>
        <div className={styles.instructionSteps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Upload CSV File</h3>
              <p className={styles.stepDescription}>
                Go to the Filter Leads tab and upload your Meta/Facebook Lead Form CSV file using the drag-and-drop area or file selector.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Edit Headers</h3>
              <p className={styles.stepDescription}>
                After uploading, you can edit column headers, remove unwanted columns, and set phone number formatting options.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Process and Download</h3>
              <p className={styles.stepDescription}>
                Click the &quot;Process and Download&quot; button to apply your changes and download the processed CSV file.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Split Leads (Optional)</h3>
              <p className={styles.stepDescription}>
                Go to the Split Leads tab to divide your leads among multiple users. Add user names and download a ZIP file with separate CSV files for each user.
              </p>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
