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
              Upload your CSV files from Meta/Facebook Lead Forms and filter leads based on specific criteria.
            </p>
            <Link href="/csv-processor" className={styles.featureLink}>
              Filter Leads →
            </Link>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Advanced Filtering</h3>
            <p className={styles.featureDescription}>
              Use multiple filters simultaneously to narrow down your leads based on various criteria.
            </p>
            <Link href="/advanced-filter" className={styles.featureLink}>
              Advanced Filter →
            </Link>
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
            <Link href="/split-leads" className={styles.featureLink}>
              Split Leads →
            </Link>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 17L12 21L16 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 12V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.88 18.09C21.7494 17.4786 22.4014 16.6061 22.7413 15.5991C23.0812 14.5921 23.0914 13.5014 22.7704 12.4875C22.4494 11.4735 21.8139 10.5871 20.9561 9.95964C20.0983 9.33217 19.0628 8.98877 18 8.98H16.74C16.4392 7.82787 15.8765 6.7393 15.0941 5.81614C14.3117 4.89297 13.3301 4.15932 12.2232 3.67041C11.1163 3.1815 9.91284 2.95008 8.70352 2.99357C7.4942 3.03706 6.31051 3.35425 5.24155 3.92153C4.17259 4.48881 3.24623 5.29028 2.53219 6.26341C1.81815 7.23654 1.33505 8.35859 1.11926 9.54711C0.903472 10.7356 0.960612 11.9571 1.28638 13.1232C1.61215 14.2894 2.19806 15.3656 2.99998 16.27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Merge Leads</h3>
            <p className={styles.featureDescription}>
              Combine multiple CSV files into a single file for easier management of your leads.
            </p>
            <Link href="/merge-leads" className={styles.featureLink}>
              Merge Leads →
            </Link>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 3H5C3.89543 3 3 3.89543 3 5V9C3 10.1046 3.89543 11 5 11H9C10.1046 11 11 10.1046 11 9V5C11 3.89543 10.1046 3 9 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 3H15C13.8954 3 13 3.89543 13 5V9C13 10.1046 13.8954 11 15 11H19C20.1046 11 21 10.1046 21 9V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 13H5C3.89543 13 3 13.8954 3 15V19C3 20.1046 3.89543 21 5 21H9C10.1046 21 11 20.1046 11 19V15C11 13.8954 10.1046 13 9 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 16L16 21M16 16L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Cross-Check Leads</h3>
            <p className={styles.featureDescription}>
              Compare two CSV files to find and remove duplicate leads from your primary file.
            </p>
            <Link href="/cross-check" className={styles.featureLink}>
              Cross-Check Leads →
            </Link>
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
            <Link href="/csv-processor" className={styles.featureLink}>
              Edit Headers →
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.instructionsContainer}>
        <h2 className={styles.sectionTitle}>How to Use</h2>
        <div className={styles.instructionSteps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Filter Leads</h3>
              <p className={styles.stepDescription}>
                Upload your CSV file and filter leads based on specific criteria. Use the quick filters to select values from each column and instantly see filtered results.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Advanced Filtering</h3>
              <p className={styles.stepDescription}>
                Use multiple filters simultaneously to narrow down your leads based on various criteria. Perfect for creating targeted lead lists.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Split Leads</h3>
              <p className={styles.stepDescription}>
                Divide your leads evenly among multiple users. Add user names and download a ZIP file with separate CSV files for each user.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Merge Leads</h3>
              <p className={styles.stepDescription}>
                Combine multiple CSV files into a single file. Upload multiple files at once and download a merged CSV with all your leads.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>5</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Cross-Check Leads</h3>
              <p className={styles.stepDescription}>
                Upload two CSV files to find duplicates between them. Select which duplicates to remove from your primary file and download the cleaned data.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>6</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Edit Headers</h3>
              <p className={styles.stepDescription}>
                Customize column headers, remove unwanted columns, and format phone numbers based on country codes for better data organization.
              </p>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
