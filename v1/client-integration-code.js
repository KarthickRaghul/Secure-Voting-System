// CLIENT-SIDE IMPLEMENTATION
// This code runs in the browser and integrates with the backend

// ============================================================
// SETUP: Include in your HTML
// ============================================================
/*
<script src="https://cdnjs.cloudflare.com/ajax/libs/paillier-bigint/3.4.1/paillier-bigint.min.js"></script>

Or install via npm:
npm install paillier-bigint
*/

// ============================================================
// CLIENT CLASS: Handles all client-side operations
// ============================================================

class SecureVotingClient {
  constructor(apiBaseUrl = 'http://localhost:3001/api/voting') {
    this.apiBaseUrl = apiBaseUrl;
    this.sessionId = null;
    this.publicKey = null;
    this.privateKey = null;
    this.paillierPublicKey = null;
    this.paillierPrivateKey = null;
  }

  // ============================================================
  // STEP 1: Initialize Voting Session
  // ============================================================
  async initializeSession() {
    try {
      console.log('🔐 Initializing secure voting session...');
      
      const response = await fetch(`${this.apiBaseUrl}/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to initialize session');
      }

      const data = await response.json();
      
      // Store session information
      this.sessionId = data.sessionId;
      this.publicKey = data.publicKey;
      this.privateKey = data.privateKey;

      // Create Paillier key objects
      this.paillierPublicKey = new paillier.PublicKey(
        BigInt(this.publicKey.n),
        BigInt(this.publicKey.g)
      );

      this.paillierPrivateKey = new paillier.PrivateKey(
        BigInt(this.privateKey.lambda),
        BigInt(this.privateKey.mu),
        this.paillierPublicKey
      );

      console.log('✅ Session initialized:', this.sessionId);
      console.log('🔑 Public key generated (shared with server)');
      console.log('🔐 Private key generated (kept secret on client)');
      
      return {
        success: true,
        sessionId: this.sessionId,
        message: data.message
      };
    } catch (error) {
      console.error('❌ Error initializing session:', error);
      throw error;
    }
  }

  // ============================================================
  // STEP 2: Encrypt and Submit Vote
  // ============================================================
  async castVote(vote) {
    try {
      if (!this.sessionId || !this.paillierPublicKey) {
        throw new Error('Session not initialized. Call initializeSession() first.');
      }

      if (vote !== 0 && vote !== 1) {
        throw new Error('Vote must be 0 (No) or 1 (Yes)');
      }

      console.log('🗳️  Casting vote:', vote === 1 ? 'YES' : 'NO');
      console.log('🔒 Encrypting vote on client side...');

      // ENCRYPT VOTE using Paillier public key
      const encryptedVote = this.paillierPublicKey.encrypt(BigInt(vote));
      const encryptedVoteString = encryptedVote.toString();

      console.log('✅ Vote encrypted successfully');
      console.log('📤 Sending encrypted vote to server...');

      // Submit encrypted vote to server
      const response = await fetch(`${this.apiBaseUrl}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          encryptedVote: encryptedVoteString
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit vote');
      }

      const data = await response.json();
      
      console.log('✅ Vote submitted successfully');
      console.log('📊 Total votes in session:', data.voteCount);
      console.log('🔒 Server cannot decrypt your vote!');

      return {
        success: true,
        voteCount: data.voteCount,
        encryptedVote: encryptedVoteString.substring(0, 50) + '...',
        message: data.message
      };
    } catch (error) {
      console.error('❌ Error casting vote:', error);
      throw error;
    }
  }

  // ============================================================
  // STEP 3: Request Server to Compute on Encrypted Data
  // ============================================================
  async computeResults() {
    try {
      if (!this.sessionId) {
        throw new Error('Session not initialized');
      }

      console.log('🔢 Requesting server to compute results...');
      console.log('⚡ Server will perform HOMOMORPHIC ADDITION on encrypted votes');

      const response = await fetch(`${this.apiBaseUrl}/compute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: this.sessionId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to compute results');
      }

      const data = await response.json();
      
      console.log('✅ Server computed results on encrypted data');
      console.log('🔒 Result is still encrypted');
      console.log('📊 Vote count:', data.voteCount);

      return {
        success: true,
        encryptedResult: data.encryptedResult,
        voteCount: data.voteCount,
        message: data.message
      };
    } catch (error) {
      console.error('❌ Error computing results:', error);
      throw error;
    }
  }

  // ============================================================
  // STEP 4: Decrypt Results (CLIENT SIDE ONLY)
  // ============================================================
  async decryptResults(encryptedResult) {
    try {
      if (!this.paillierPrivateKey) {
        throw new Error('Private key not available');
      }

      console.log('🔓 Decrypting results with private key...');

      // DECRYPT using private key (only client can do this!)
      const decryptedSum = this.paillierPrivateKey.decrypt(
        BigInt(encryptedResult)
      );

      const totalYesVotes = Number(decryptedSum);
      
      console.log('✅ Results decrypted successfully');
      console.log('📊 Total YES votes:', totalYesVotes);

      return {
        success: true,
        totalYesVotes: totalYesVotes,
        message: 'Results decrypted on client side'
      };
    } catch (error) {
      console.error('❌ Error decrypting results:', error);
      throw error;
    }
  }

  // ============================================================
  // UTILITY: Get Session Info
  // ============================================================
  async getSessionInfo() {
    try {
      if (!this.sessionId) {
        throw new Error('Session not initialized');
      }

      const response = await fetch(
        `${this.apiBaseUrl}/session/${this.sessionId}`
      );

      if (!response.ok) {
        throw new Error('Failed to get session info');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Error getting session info:', error);
      throw error;
    }
  }

  // ============================================================
  // UTILITY: Export Keys (for backup/recovery)
  // ============================================================
  exportKeys() {
    if (!this.sessionId || !this.publicKey || !this.privateKey) {
      throw new Error('No keys to export');
    }

    return {
      sessionId: this.sessionId,
      publicKey: this.publicKey,
      privateKey: this.privateKey,
      warning: 'Keep private key secure! Anyone with this can decrypt votes.'
    };
  }

  // ============================================================
  // UTILITY: Import Keys (for recovery)
  // ============================================================
  importKeys(keys) {
    this.sessionId = keys.sessionId;
    this.publicKey = keys.publicKey;
    this.privateKey = keys.privateKey;

    this.paillierPublicKey = new paillier.PublicKey(
      BigInt(this.publicKey.n),
      BigInt(this.publicKey.g)
    );

    this.paillierPrivateKey = new paillier.PrivateKey(
      BigInt(this.privateKey.lambda),
      BigInt(this.privateKey.mu),
      this.paillierPublicKey
    );

    console.log('✅ Keys imported successfully');
  }
}

// ============================================================
// COMPLETE USAGE EXAMPLE
// ============================================================

async function completeVotingExample() {
  console.log('='.repeat(60));
  console.log('COMPLETE HOMOMORPHIC VOTING EXAMPLE');
  console.log('='.repeat(60));

  // Create client
  const client = new SecureVotingClient();

  try {
    // STEP 1: Initialize session
    console.log('\n--- STEP 1: Initialize Session ---');
    await client.initializeSession();

    // STEP 2: Cast multiple votes
    console.log('\n--- STEP 2: Cast Votes ---');
    await client.castVote(1); // YES
    await client.castVote(1); // YES
    await client.castVote(0); // NO
    await client.castVote(1); // YES

    // STEP 3: Server computes on encrypted data
    console.log('\n--- STEP 3: Compute Results (Server Side) ---');
    const computeResult = await client.computeResults();

    // STEP 4: Client decrypts results
    console.log('\n--- STEP 4: Decrypt Results (Client Side) ---');
    const decryptResult = await client.decryptResults(
      computeResult.encryptedResult
    );

    console.log('\n='.repeat(60));
    console.log('FINAL RESULTS');
    console.log('='.repeat(60));
    console.log('Total YES votes:', decryptResult.totalYesVotes);
    console.log('Total NO votes:', computeResult.voteCount - decryptResult.totalYesVotes);
    console.log('Total votes:', computeResult.voteCount);
    console.log('='.repeat(60));

    // STEP 5: Demonstrate key export/import
    console.log('\n--- STEP 5: Key Management ---');
    const exportedKeys = client.exportKeys();
    console.log('Keys exported (can be saved for later use)');
    console.log('Session ID:', exportedKeys.sessionId);

    return {
      success: true,
      results: decryptResult
    };

  } catch (error) {
    console.error('Voting example failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// ============================================================
// REACT INTEGRATION EXAMPLE
// ============================================================

/*
// Example React Component Integration

import React, { useState, useEffect } from 'react';

function VotingApp() {
  const [client] = useState(() => new SecureVotingClient());
  const [sessionId, setSessionId] = useState(null);
  const [results, setResults] = useState(null);

  // Initialize on mount
  useEffect(() => {
    const init = async () => {
      const result = await client.initializeSession();
      setSessionId(result.sessionId);
    };
    init();
  }, [client]);

  // Cast vote
  const handleVote = async (vote) => {
    try {
      await client.castVote(vote);
      alert('Vote cast successfully!');
    } catch (error) {
      alert('Error casting vote: ' + error.message);
    }
  };

  // Compute and decrypt results
  const handleGetResults = async () => {
    try {
      const computeResult = await client.computeResults();
      const decryptResult = await client.decryptResults(
        computeResult.encryptedResult
      );
      setResults(decryptResult);
    } catch (error) {
      alert('Error getting results: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Secure Voting</h1>
      <p>Session: {sessionId}</p>
      
      <button onClick={() => handleVote(1)}>Vote YES</button>
      <button onClick={() => handleVote(0)}>Vote NO</button>
      <button onClick={handleGetResults}>Get Results</button>
      
      {results && (
        <div>
          <h2>Results</h2>
          <p>YES Votes: {results.totalYesVotes}</p>
        </div>
      )}
    </div>
  );
}
*/

// ============================================================
// HTML INTEGRATION EXAMPLE
// ============================================================

/*
<!DOCTYPE html>
<html>
<head>
  <title>Secure Voting</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/paillier-bigint/3.4.1/paillier-bigint.min.js"></script>
  <script src="voting-client.js"></script>
</head>
<body>
  <h1>Secure Voting System</h1>
  
  <button onclick="initVoting()">Initialize</button>
  <button onclick="voteYes()">Vote YES</button>
  <button onclick="voteNo()">Vote NO</button>
  <button onclick="showResults()">Get Results</button>
  
  <div id="output"></div>
  
  <script>
    let votingClient = new SecureVotingClient();
    
    async function initVoting() {
      await votingClient.initializeSession();
      document.getElementById('output').innerHTML = 'Session initialized!';
    }
    
    async function voteYes() {
      await votingClient.castVote(1);
      document.getElementById('output').innerHTML = 'YES vote cast!';
    }
    
    async function voteNo() {
      await votingClient.castVote(0);
      document.getElementById('output').innerHTML = 'NO vote cast!';
    }
    
    async function showResults() {
      const computeResult = await votingClient.computeResults();
      const decryptResult = await votingClient.decryptResults(
        computeResult.encryptedResult
      );
      
      document.getElementById('output').innerHTML = 
        `YES: ${decryptResult.totalYesVotes}, ` +
        `NO: ${computeResult.voteCount - decryptResult.totalYesVotes}`;
    }
  </script>
</body>
</html>
*/

// ============================================================
// EXPORT FOR USE IN OTHER FILES
// ============================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SecureVotingClient;
}

// Make available in browser
if (typeof window !== 'undefined') {
  window.SecureVotingClient = SecureVotingClient;
  window.completeVotingExample = completeVotingExample;
}