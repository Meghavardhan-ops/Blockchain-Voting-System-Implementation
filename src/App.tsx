import React, { useState, useEffect } from 'react';
import { Vote, Candidate, Voter } from './types/blockchain';
import { Blockchain } from './utils/blockchain';
import { VoterDatabase } from './utils/voterDatabase';
import { BarChart as ChartBar, Lock, Vote as VoteIcon, UserCheck, AlertCircle } from 'lucide-react';

const blockchain = new Blockchain();
const voterDatabase = new VoterDatabase();

const candidates: Candidate[] = [
  {
    id: '1',
    name: 'Candidate A',
    description: 'Experienced leader with a vision for the future',
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e'
  },
  {
    id: '2',
    name: 'Candidate B',
    description: 'Innovative thinker focused on sustainable solutions',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a'
  },
];

function App() {
  const [voterId, setVoterId] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [results, setResults] = useState<Record<string, number>>({});
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [isVoting, setIsVoting] = useState(false);
  const [voterInfo, setVoterInfo] = useState<Voter | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [voterStats, setVoterStats] = useState({
    registered: 0,
    voted: 0
  });

  useEffect(() => {
    updateResults();
    updateVoterStats();
  }, []);

  const updateResults = () => {
    setResults(blockchain.getVoteCount());
  };

  const updateVoterStats = () => {
    setVoterStats({
      registered: voterDatabase.getRegisteredVoterCount(),
      voted: voterDatabase.getVotedCount()
    });
  };

  const checkVoter = () => {
    setError(null);
    if (!voterId) {
      setError('Please enter your Voter ID');
      setVoterInfo(null);
      return false;
    }

    const voter = voterDatabase.getVoter(voterId);
    if (!voter) {
      setError('Voter ID not found. Please check your ID and try again.');
      setVoterInfo(null);
      return false;
    }

    if (!voter.registered) {
      setError('Your voter registration is not active.');
      setVoterInfo(voter);
      return false;
    }

    if (voter.hasVoted || blockchain.hasVoted(voterId)) {
      setError('You have already cast your vote.');
      setVoterInfo(voter);
      return false;
    }

    setVoterInfo(voter);
    return true;
  };

  const handleVote = async () => {
    if (!voterId || !selectedCandidate || isVoting) return;

    if (!checkVoter()) {
      return;
    }

    setIsVoting(true);
    try {
      const vote: Vote = {
        voter: voterId,
        candidate: selectedCandidate
      };

      await blockchain.createBlock(vote);
      voterDatabase.markAsVoted(voterId);
      setHasVoted(true);
      updateResults();
      updateVoterStats();
    } catch (error) {
      console.error('Error casting vote:', error);
      setError('There was an error casting your vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            <VoteIcon className="inline-block mr-2 mb-1" />
            Blockchain Voting System
          </h1>
          <p className="text-gray-600">Secure and transparent voting powered by blockchain technology</p>
          
          <div className="flex justify-center mt-4 space-x-6">
            <div className="bg-white rounded-lg shadow px-4 py-2">
              <p className="text-sm text-gray-500">Registered Voters</p>
              <p className="text-2xl font-bold text-blue-600">{voterStats.registered}</p>
            </div>
            <div className="bg-white rounded-lg shadow px-4 py-2">
              <p className="text-sm text-gray-500">Votes Cast</p>
              <p className="text-2xl font-bold text-blue-600">{voterStats.voted}</p>
            </div>
          </div>
        </div>

        {!hasVoted ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Cast Your Vote</h2>
              
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  placeholder="Enter your voter ID (e.g., V001)"
                  value={voterId}
                  onChange={(e) => setVoterId(e.target.value)}
                  className="flex-1 p-2 border rounded"
                />
                <button 
                  onClick={checkVoter}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
                >
                  Verify
                </button>
              </div>
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              )}
              
              {voterInfo && !voterInfo.hasVoted && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                  <div className="flex">
                    <UserCheck className="h-5 w-5 text-green-500 mr-2" />
                    <div>
                      <p className="text-green-700 font-medium">Voter Verified</p>
                      <p className="text-green-600">Welcome, {voterInfo.name}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedCandidate === candidate.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedCandidate(candidate.id)}
                  >
                    <img
                      src={candidate.imageUrl}
                      alt={candidate.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-xl font-semibold mb-2">{candidate.name}</h3>
                    <p className="text-gray-600">{candidate.description}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={handleVote}
                disabled={!voterId || !selectedCandidate || isVoting || !voterInfo || voterInfo.hasVoted}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isVoting ? 'Recording Vote...' : 'Cast Vote'}
              </button>
              
              <p className="text-xs text-gray-500 mt-2 text-center">
                Use voter IDs V001-V005 to test the system
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
              <Lock className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-green-600">Vote Successfully Recorded!</h2>
              <p className="text-gray-600">Your vote has been securely added to the blockchain</p>
              {voterInfo && (
                <p className="mt-2 text-blue-600">Thank you for voting, {voterInfo.name}</p>
              )}
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <ChartBar className="mr-2" />
            Current Results
          </h2>
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                      {candidate.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-blue-600">
                      {results[candidate.id] || 0} votes
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                  <div
                    style={{
                      width: `${((results[candidate.id] || 0) / Math.max(...Object.values(results), 1)) * 100}%`
                    }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;