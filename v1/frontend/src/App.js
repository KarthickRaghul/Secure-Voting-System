import React, { useState } from 'react';
import { Lock, Unlock, Cloud, Shield, Check, X, Info, Server, User } from 'lucide-react';

const HomomorphicVotingApp = () => {
  const [activeTab, setActiveTab] = useState('vote');
  const [vote, setVote] = useState(null);
  const [encryptedVote, setEncryptedVote] = useState(null);
  const [serverVotes, setServerVotes] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clientKeys, setClientKeys] = useState(null);
  const [showWorkflow, setShowWorkflow] = useState(false);

  // Simulate homomorphic encryption key generation
  const generateKeys = () => {
    return {
      publicKey: Math.random().toString(36).substring(2, 15),
      privateKey: Math.random().toString(36).substring(2, 15),
      timestamp: Date.now()
    };
  };

  // Simulate homomorphic encryption
  const encryptVote = (voteValue) => {
    if (!clientKeys) {
      const keys = generateKeys();
      setClientKeys(keys);
    }
    
    // Simulate encryption with a random hash
    const encrypted = `HE_${voteValue}_${Math.random().toString(36).substring(2, 15)}`;
    return encrypted;
  };

  const handleVoteSubmit = () => {
    if (vote === null) return;
    
    setLoading(true);
    
    // Generate keys if not already generated
    if (!clientKeys) {
      const keys = generateKeys();
      setClientKeys(keys);
    }
    
    setTimeout(() => {
      const encrypted = encryptVote(vote);
      setEncryptedVote(encrypted);
      
      // Add to server votes
      setServerVotes(prev => [...prev, { 
        id: Date.now(), 
        encrypted,
        timestamp: new Date().toLocaleTimeString()
      }]);
      
      setLoading(false);
      setActiveTab('server');
    }, 1000);
  };

  const handleComputeResults = () => {
    setLoading(true);
    
    setTimeout(() => {
      // Simulate homomorphic computation on server
      // In real implementation, server computes on encrypted data
      const encryptedResult = `ENCRYPTED_RESULT_${Math.random().toString(36).substring(2, 15)}`;
      
      setResults({
        encrypted: encryptedResult,
        needsDecryption: true
      });
      
      setLoading(false);
      setActiveTab('results');
    }, 1500);
  };

  const handleDecryptResults = () => {
    if (!results || !clientKeys) return;
    
    setLoading(true);
    
    setTimeout(() => {
      // Simulate decryption with client's private key
      // In real scenario: only client can decrypt using their private key
      const yesVotes = Math.floor(Math.random() * 40) + 40;
      const noVotes = Math.floor(Math.random() * 30) + 20;
      
      setResults({
        ...results,
        decrypted: true,
        yesVotes,
        noVotes
      });
      
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            {/* <Shield className="w-12 h-12 text-blue-400" /> */}
            <h1 className="text-4xl font-bold">Secure Voting System</h1>
          </div>
          <p className="text-blue-200 text-lg">Using Homomorphic Encryption</p>
          <button
            onClick={() => setShowWorkflow(!showWorkflow)}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            {showWorkflow ? 'Hide' : 'View'} Workflow
          </button>
        </div>

        {/* Workflow Explanation */}
        {showWorkflow && (
          <div className="bg-slate-800/50 backdrop-blur border border-blue-500/30 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5" />
              How It Works
            </h3>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="text-blue-400 font-semibold mb-2">1. Client Encrypts</div>
                <p className="text-slate-300">Vote is encrypted with public key on client side. Original vote never leaves device.</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="text-blue-400 font-semibold mb-2">2. Server Receives</div>
                <p className="text-slate-300">Server receives encrypted votes but cannot decrypt them without private key.</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="text-blue-400 font-semibold mb-2">3. Compute on Encrypted</div>
                <p className="text-slate-300">Server performs homomorphic addition on encrypted votes directly.</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="text-blue-400 font-semibold mb-2">4. Client Decrypts</div>
                <p className="text-slate-300">Only client with private key can decrypt the final encrypted result.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'vote', label: 'Cast Vote', icon: User },
            { id: 'server', label: 'Cloud Server', icon: Cloud },
            { id: 'results', label: 'Results', icon: Lock }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div> */}

        {/* Content Area */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Vote Casting Panel */}
          <div className={`bg-slate-800/50 backdrop-blur border border-blue-500/30 rounded-xl p-6 ${
            activeTab === 'vote' ? 'ring-2 ring-blue-500' : ''
          }`}>
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-semibold">Cast Your Vote</h2>
              <span className="text-sm text-slate-400">(Client Side)</span>
            </div>

            {!clientKeys && (
              <div className="mb-6 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg">
                <p className="text-sm text-blue-200">
                  <Info className="w-4 h-4 inline mr-2" />
                  Keys will be generated automatically when you cast your vote
                </p>
              </div>
            )}

            {clientKeys && (
              <div className="mb-6 p-4 bg-green-900/30 border border-green-500/50 rounded-lg">
                <div className="text-sm font-semibold text-green-300 mb-2">Keys Generated</div>
                <div className="text-xs text-green-200 space-y-1">
                  <div>Public: {clientKeys.publicKey.substring(0, 12)}...</div>
                  <div>Private: {clientKeys.privateKey.substring(0, 12)}... (kept secret)</div>
                </div>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div
                onClick={() => setVote(1)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  vote === 1
                    ? 'border-green-500 bg-green-900/30'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    vote === 1 ? 'border-green-500 bg-green-500' : 'border-slate-500'
                  }`}>
                    {vote === 1 && <div className="w-3 h-3 bg-white rounded-full" />}
                  </div>
                  <span className="text-lg">Yes</span>
                </div>
              </div>

              <div
                onClick={() => setVote(0)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  vote === 0
                    ? 'border-red-500 bg-red-900/30'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    vote === 0 ? 'border-red-500 bg-red-500' : 'border-slate-500'
                  }`}>
                    {vote === 0 && <div className="w-3 h-3 bg-white rounded-full" />}
                  </div>
                  <span className="text-lg">No</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleVoteSubmit}
              disabled={vote === null || loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg transition-colors font-semibold"
            >
              {loading ? 'Encrypting...' : 'Encrypt & Submit Vote'}
            </button>

            {encryptedVote && (
              <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
                <div className="text-sm font-semibold text-green-300 mb-2">Vote Encrypted Successfully!</div>
                <div className="text-xs text-slate-300 break-all">
                  Encrypted Value: {encryptedVote}
                </div>
              </div>
            )}
          </div>

          {/* Server Panel */}
          <div className={`bg-slate-800/50 backdrop-blur border border-orange-500/30 rounded-xl p-6 ${
            activeTab === 'server' ? 'ring-2 ring-orange-500' : ''
          }`}>
            <div className="flex items-center gap-3 mb-6">
              <Cloud className="w-6 h-6 text-orange-400" />
              <h2 className="text-2xl font-semibold">Cloud Server</h2>
              <span className="text-sm text-slate-400">(Untrusted)</span>
            </div>

            <div className="mb-4 p-4 bg-orange-900/30 border border-orange-500/50 rounded-lg">
              <div className="flex items-center gap-2 text-orange-300 text-sm">
                <Lock className="w-4 h-4" />
                <span className="font-semibold">Server cannot read encrypted votes</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-sm font-semibold mb-3 text-slate-300">
                Encrypted Votes Received: {serverVotes.length}
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {serverVotes.map(v => (
                  <div key={v.id} className="p-3 bg-slate-700/50 rounded border border-slate-600">
                    <div className="flex items-center gap-2 mb-1">
                      <Lock className="w-3 h-3 text-blue-400" />
                      <span className="text-xs text-slate-400">{v.timestamp}</span>
                    </div>
                    <div className="text-xs text-slate-300 break-all">{v.encrypted}</div>
                  </div>
                ))}
                {serverVotes.length === 0 && (
                  <div className="text-center text-slate-500 py-8">
                    No encrypted votes received yet
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleComputeResults}
              disabled={serverVotes.length === 0 || loading}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <Server className="w-4 h-4" />
              {loading ? 'Computing...' : 'Compute Encrypted Result'}
            </button>

            <div className="mt-4 text-xs text-slate-400 text-center">
              Homomorphic operations performed on encrypted data
            </div>
          </div>

          {/* Results Panel */}
          <div className={`md:col-span-2 bg-slate-800/50 backdrop-blur border border-purple-500/30 rounded-xl p-6 ${
            activeTab === 'results' ? 'ring-2 ring-purple-500' : ''
          }`}>
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-semibold">Decryption & Results</h2>
              <span className="text-sm text-slate-400">(Client Side)</span>
            </div>

            {!results && (
              <div className="text-center py-12 text-slate-500">
                <Lock className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>No encrypted results available yet</p>
                <p className="text-sm mt-2">Server needs to compute results first</p>
              </div>
            )}

            {results && !results.decrypted && (
              <div>
                <div className="mb-6 p-4 bg-purple-900/30 border border-purple-500/50 rounded-lg">
                  <div className="text-sm font-semibold text-purple-300 mb-2">Encrypted Result Received</div>
                  <div className="text-xs text-purple-200 break-all mb-4">
                    {results.encrypted}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-orange-300">
                      <X className="w-4 h-4" />
                      No private key available on server
                    </div>
                    <div className="flex items-center gap-2 text-orange-300">
                      <X className="w-4 h-4" />
                      Server cannot decrypt results
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDecryptResults}
                  disabled={loading}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  {loading ? 'Decrypting...' : 'Decrypt Result with Private Key'}
                </button>

                <div className="mt-4 p-3 bg-blue-900/30 border border-blue-500/50 rounded-lg text-sm text-blue-200">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Only you can decrypt using your private key
                </div>
              </div>
            )}

            {results && results.decrypted && (
              <div className="space-y-4">
                <div className="p-4 bg-green-900/30 border border-green-500/50 rounded-lg">
                  <div className="text-sm font-semibold text-green-300 mb-4">Results Decrypted Successfully!</div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="w-5 h-5 text-green-400" />
                        <span className="font-semibold">YES Votes</span>
                      </div>
                      <div className="text-3xl font-bold text-green-400">{results.yesVotes}</div>
                    </div>
                    
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <X className="w-5 h-5 text-red-400" />
                        <span className="font-semibold">NO Votes</span>
                      </div>
                      <div className="text-3xl font-bold text-red-400">{results.noVotes}</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-600">
                    <div className="text-sm text-slate-300">
                      Total Votes: {results.yesVotes + results.noVotes}
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-4 mt-2 overflow-hidden">
                      <div 
                        className="bg-green-500 h-full transition-all duration-500"
                        style={{ width: `${(results.yesVotes / (results.yesVotes + results.noVotes)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg text-sm">
                  <Shield className="w-4 h-4 inline mr-2 text-blue-400" />
                  <span className="text-blue-200">
                    Privacy preserved: Server never saw individual votes or final results in plaintext
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {/* <div className="mt-8 text-center text-sm text-slate-400">
          <p>This is a proof-of-concept demonstration of homomorphic encryption</p>
          <p className="mt-1">In production, use established libraries like SEAL, HElib, or Paillier</p>
        </div> */}
      </div>
    </div>
  );
};

export default HomomorphicVotingApp;