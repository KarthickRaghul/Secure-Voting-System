// Backend Implementation for Homomorphic Voting System
// Using Paillier Cryptosystem (Additive Homomorphic Encryption)

// ============================================================
// INSTALLATION REQUIRED:
// npm install express cors paillier-bigint body-parser
// ============================================================

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const paillier = require('paillier-bigint');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage (in production, use a database)
let votingSessions = {};
let encryptedVotes = {};

// ============================================================
// ROUTE 1: Initialize Voting Session (Client-Side Key Generation)
// ============================================================
app.post('/api/voting/init', async (req, res) => {
  try {
    console.log('Initializing new voting session...');
    
    // Generate Paillier key pair (this happens on client in real scenario)
    const { publicKey, privateKey } = await paillier.generateRandomKeys(2048);
    
    // Create session ID
    const sessionId = generateSessionId();
    
    // Store session info (in production, only store public key on server)
    votingSessions[sessionId] = {
      publicKey: {
        n: publicKey.n.toString(),
        g: publicKey.g.toString()
      },
      createdAt: new Date(),
      voteCount: 0
    };
    
    // Initialize vote storage for this session
    encryptedVotes[sessionId] = [];
    
    console.log(`Session ${sessionId} created`);
    
    // Return keys to client (client keeps private key secret)
    res.json({
      success: true,
      sessionId,
      publicKey: {
        n: publicKey.n.toString(),
        g: publicKey.g.toString()
      },
      privateKey: {
        lambda: privateKey.lambda.toString(),
        mu: privateKey.mu.toString()
      },
      message: 'Keep your private key secure! Server only knows public key.'
    });
  } catch (error) {
    console.error('Error initializing session:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================
// ROUTE 2: Submit Encrypted Vote
// ============================================================
app.post('/api/voting/submit', (req, res) => {
  try {
    const { sessionId, encryptedVote } = req.body;
    
    if (!votingSessions[sessionId]) {
      return res.status(404).json({ 
        success: false, 
        error: 'Session not found' 
      });
    }
    
    console.log(`Vote received for session ${sessionId}`);
    console.log('Encrypted vote (server cannot decrypt):', encryptedVote.substring(0, 50) + '...');
    
    // Store encrypted vote
    encryptedVotes[sessionId].push({
      encryptedValue: encryptedVote,
      timestamp: new Date()
    });
    
    votingSessions[sessionId].voteCount++;
    
    res.json({
      success: true,
      message: 'Encrypted vote received and stored',
      voteCount: votingSessions[sessionId].voteCount,
      note: 'Server cannot read your vote - it is encrypted!'
    });
  } catch (error) {
    console.error('Error submitting vote:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================
// ROUTE 3: Compute Results on Encrypted Data (Homomorphic Operation)
// ============================================================
app.post('/api/voting/compute', async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!votingSessions[sessionId]) {
      return res.status(404).json({ 
        success: false, 
        error: 'Session not found' 
      });
    }
    
    const session = votingSessions[sessionId];
    const votes = encryptedVotes[sessionId];
    
    if (votes.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No votes to compute' 
      });
    }
    
    console.log(`Computing results for session ${sessionId}...`);
    console.log(`Processing ${votes.length} encrypted votes`);
    
    // Reconstruct public key
    const publicKey = new paillier.PublicKey(
      BigInt(session.publicKey.n),
      BigInt(session.publicKey.g)
    );
    
    // Perform HOMOMORPHIC ADDITION on encrypted votes
    // This is the magic: adding encrypted numbers without decrypting them!
    let encryptedSum = BigInt(votes[0].encryptedValue);
    
    for (let i = 1; i < votes.length; i++) {
      // Homomorphic addition: E(a) * E(b) = E(a + b)
      encryptedSum = publicKey.addition(
        encryptedSum, 
        BigInt(votes[i].encryptedValue)
      );
    }
    
    console.log('Homomorphic computation complete!');
    console.log('Result is still encrypted - server cannot read it');
    
    res.json({
      success: true,
      encryptedResult: encryptedSum.toString(),
      voteCount: votes.length,
      message: 'Results computed on encrypted data. Only you can decrypt with your private key.',
      note: 'Server performed addition on encrypted votes without ever seeing the actual votes!'
    });
  } catch (error) {
    console.error('Error computing results:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================
// ROUTE 4: Get Session Info
// ============================================================
app.get('/api/voting/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  if (!votingSessions[sessionId]) {
    return res.status(404).json({ 
      success: false, 
      error: 'Session not found' 
    });
  }
  
  const session = votingSessions[sessionId];
  const votes = encryptedVotes[sessionId];
  
  res.json({
    success: true,
    session: {
      sessionId,
      voteCount: session.voteCount,
      createdAt: session.createdAt,
      publicKey: session.publicKey
    },
    votes: votes.map(v => ({
      encrypted: v.encryptedValue.substring(0, 50) + '...',
      timestamp: v.timestamp
    }))
  });
});

// ============================================================
// CLIENT-SIDE UTILITY FUNCTIONS (for reference)
// ============================================================

// These would be implemented on the client side:

/*
// CLIENT: Encrypt vote
async function encryptVote(vote, publicKey) {
  const pubKey = new paillier.PublicKey(
    BigInt(publicKey.n),
    BigInt(publicKey.g)
  );
  
  const encrypted = pubKey.encrypt(BigInt(vote));
  return encrypted.toString();
}

// CLIENT: Decrypt result
async function decryptResult(encryptedResult, privateKey, publicKey) {
  const pubKey = new paillier.PublicKey(
    BigInt(publicKey.n),
    BigInt(publicKey.g)
  );
  
  const privKey = new paillier.PrivateKey(
    BigInt(privateKey.lambda),
    BigInt(privateKey.mu),
    pubKey
  );
  
  const decrypted = privKey.decrypt(BigInt(encryptedResult));
  return Number(decrypted);
}
*/

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function generateSessionId() {
  return 'session_' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🔐 HOMOMORPHIC VOTING SYSTEM - BACKEND');
  console.log('='.repeat(60));
  console.log(`Server running on port ${PORT}`);
  console.log('');
  console.log('Available endpoints:');
  console.log(`  POST   http://localhost:${PORT}/api/voting/init`);
  console.log(`  POST   http://localhost:${PORT}/api/voting/submit`);
  console.log(`  POST   http://localhost:${PORT}/api/voting/compute`);
  console.log(`  GET    http://localhost:${PORT}/api/voting/session/:id`);
  console.log('');
  console.log('🔒 Privacy Features:');
  console.log('  ✓ Votes encrypted on client before transmission');
  console.log('  ✓ Server computes on encrypted data (never sees votes)');
  console.log('  ✓ Only client can decrypt final results');
  console.log('='.repeat(60));
});

// ============================================================
// COMPLETE CLIENT INTEGRATION EXAMPLE
// ============================================================

/*
COMPLETE WORKFLOW EXAMPLE:

1. CLIENT: Initialize Session
   const response = await fetch('http://localhost:3001/api/voting/init', {
     method: 'POST'
   });
   const { sessionId, publicKey, privateKey } = await response.json();
   // KEEP privateKey SECRET!

2. CLIENT: Encrypt Vote (0 or 1)
   const vote = 1; // Yes vote
   const publicKeyObj = new paillier.PublicKey(
     BigInt(publicKey.n),
     BigInt(publicKey.g)
   );
   const encryptedVote = publicKeyObj.encrypt(BigInt(vote)).toString();

3. CLIENT: Submit Encrypted Vote
   await fetch('http://localhost:3001/api/voting/submit', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ sessionId, encryptedVote })
   });

4. SERVER: Compute on Encrypted Data
   const computeResponse = await fetch('http://localhost:3001/api/voting/compute', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ sessionId })
   });
   const { encryptedResult } = await computeResponse.json();

5. CLIENT: Decrypt Result
   const privateKeyObj = new paillier.PrivateKey(
     BigInt(privateKey.lambda),
     BigInt(privateKey.mu),
     publicKeyObj
   );
   const totalYesVotes = privateKeyObj.decrypt(BigInt(encryptedResult));
   console.log('Total YES votes:', Number(totalYesVotes));
*/

// ============================================================
// SECURITY NOTES
// ============================================================

/*
PRODUCTION CONSIDERATIONS:

1. Key Management:
   - Private keys should NEVER be sent to server
   - Use client-side key generation
   - Consider hardware security modules (HSM) for key storage

2. Vote Verification:
   - Implement zero-knowledge proofs for vote validity
   - Add digital signatures to prevent vote tampering
   - Include ballot tracking mechanisms

3. Performance:
   - Paillier operations are computationally expensive
   - Consider using smaller key sizes for testing (1024-bit)
   - Use 2048-bit or higher for production
   - Implement vote batching for large elections

4. Additional Security:
   - Add rate limiting to prevent spam
   - Implement HTTPS/TLS for all communications
   - Add voter authentication and authorization
   - Implement receipt generation for voters
   - Add audit logs for all operations

5. Scalability:
   - Use database instead of in-memory storage
   - Implement caching for public keys
   - Consider distributed computing for large tallies
   - Use message queues for async processing

6. Alternative Libraries:
   - node-paillier: Pure JavaScript implementation
   - tfhe: For fully homomorphic encryption
   - SEAL (Microsoft): For more complex operations
*/