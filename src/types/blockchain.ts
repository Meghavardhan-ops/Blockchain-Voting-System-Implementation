export interface Block {
  index: number;
  timestamp: number;
  vote: Vote;
  previousHash: string;
  hash: string;
  nonce: number;
}

export interface Vote {
  voter: string;
  candidate: string;
}

export interface Candidate {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface Voter {
  id: string;
  name: string;
  registered: boolean;
  hasVoted: boolean;
}