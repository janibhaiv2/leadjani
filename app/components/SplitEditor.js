'use client';

import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import JSZip from 'jszip';
import styles from './SplitEditor.module.css';

export default function SplitEditor({ onBackToUpload = null }) {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get data from sessionStorage
    const storedHeaders = sessionStorage.getItem('csvHeaders');
    const storedData = sessionStorage.getItem('csvData');

    if (!storedHeaders || !storedData) {
      // If no data is found, go back to upload if callback is provided
      if (onBackToUpload) {
        onBackToUpload();
      } else {
        // If used as standalone page, show a message or redirect
        setError('No CSV data found. Please upload a CSV file first.');
      }
      return;
    }

    const parsedHeaders = JSON.parse(storedHeaders);
    const parsedData = JSON.parse(storedData);

    setHeaders(parsedHeaders);
    setData(parsedData);
  }, [onBackToUpload]);

  const handleAddUser = () => {
    if (!newUserName.trim()) {
      setError('Please enter a user name');
      return;
    }

    if (users.some(user => user.name.toLowerCase() === newUserName.trim().toLowerCase())) {
      setError('User name already exists');
      return;
    }

    setUsers([...users, { id: Date.now(), name: newUserName.trim() }]);
    setNewUserName('');
    setError(null);
  };

  const handleRemoveUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddUser();
    }
  };

  const processAndDownload = async () => {
    if (users.length === 0) {
      setError('Please add at least one user');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create a new JSZip instance
      const zip = new JSZip();

      // Calculate leads per user (distribute evenly)
      // Subtract 1 from data length to account for header row
      const totalLeads = Math.max(0, data.length - 1);
      const leadsPerUser = Math.floor(totalLeads / users.length);
      let remainingLeads = totalLeads % users.length;

      let startIndex = 0;

      // Create a CSV file for each user
      for (let i = 0; i < users.length; i++) {
        const user = users[i];

        // Calculate how many leads this user gets
        let userLeadCount = leadsPerUser;
        if (remainingLeads > 0) {
          userLeadCount++;
          remainingLeads--;
        }

        // Get the leads for this user
        const userLeads = data.slice(startIndex, startIndex + userLeadCount);
        startIndex += userLeadCount;

        // Convert to CSV with headers
        const csv = Papa.unparse({
          fields: headers,
          data: userLeads.map(lead => {
            const row = {};
            headers.forEach(header => {
              row[header] = lead[header];
            });
            return row;
          })
        });

        // Add to zip
        zip.file(`${user.name.replace(/[^a-z0-9]/gi, '_')}_leads.csv`, csv);
      }

      // Generate the zip file
      const content = await zip.generateAsync({ type: 'blob' });

      // Create download link
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'split_leads.zip');
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
          rowCount: data.length,
          columnCount: headers.length,
          splitCount: users.length,
          type: 'split'
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
      console.error('Error creating zip file:', error);
      setError('Error creating zip file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate preview of lead distribution
  const getLeadDistribution = () => {
    if (users.length === 0) return [];

    // Subtract 1 from data length to account for header row
    const totalLeads = Math.max(0, data.length - 1);
    const leadsPerUser = Math.floor(totalLeads / users.length);
    let remainingLeads = totalLeads % users.length;

    return users.map(user => {
      let userLeadCount = leadsPerUser;
      if (remainingLeads > 0) {
        userLeadCount++;
        remainingLeads--;
      }
      return {
        ...user,
        leadCount: userLeadCount
      };
    });
  };

  const leadDistribution = getLeadDistribution();

  if (headers.length === 0) {
    return (
      <div className={styles.loading}>
        {error ? (
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>{error}</p>
            {onBackToUpload && (
              <button onClick={onBackToUpload} className={styles.errorButton}>
                Back to Upload
              </button>
            )}
          </div>
        ) : (
          "Loading..."
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Split Leads</h1>
      <p className={styles.subtitle}>Add users and split your leads evenly among them</p>

      <div className={styles.statsCard}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Total Leads:</span>
          <span className={styles.statValue}>{Math.max(0, data.length - 1)}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Total Columns:</span>
          <span className={styles.statValue}>{headers.length}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Users Added:</span>
          <span className={styles.statValue}>{users.length}</span>
        </div>
      </div>

      <div className={styles.addUserContainer}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter user name"
            className={styles.userInput}
          />
          <button
            onClick={handleAddUser}
            className={styles.addButton}
          >
            Add User
          </button>
        </div>
        {error && <p className={styles.errorText}>{error}</p>}
      </div>

      <div className={styles.usersContainer}>
        <h2 className={styles.sectionTitle}>Users</h2>
        {users.length === 0 ? (
          <p className={styles.emptyMessage}>No users added yet. Add users to split your leads.</p>
        ) : (
          <div className={styles.usersList}>
            {leadDistribution.map((user) => (
              <div key={user.id} className={styles.userCard}>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{user.name}</span>
                  <span className={styles.leadCount}>{user.leadCount} leads</span>
                </div>
                <button
                  onClick={() => handleRemoveUser(user.id)}
                  className={styles.removeButton}
                  title="Remove user"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.instructionContainer}>
        <div className={styles.instruction}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>
            Leads will be distributed evenly among all users. If the number of leads cannot be divided equally,
            some users will receive one extra lead. The header row is not counted as a lead.
          </span>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        {onBackToUpload && (
          <button
            onClick={onBackToUpload}
            className={styles.backButton}
          >
            Back to Upload
          </button>
        )}
        <button
          onClick={processAndDownload}
          className={styles.proceedButton}
          disabled={users.length === 0 || isLoading}
        >
          {isLoading ? 'Processing...' : 'Process and Download ZIP'}
        </button>
      </div>
    </div>
  );
}
