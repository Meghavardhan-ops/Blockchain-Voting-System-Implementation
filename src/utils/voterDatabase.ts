import { Voter } from '../types/blockchain';

export class VoterDatabase {
  private voters: Map<string, Voter> = new Map();

  constructor() {
    // Initialize with some sample voters
    this.registerVoter('V001', 'John Doe');
    this.registerVoter('V002', 'Jane Smith');
    this.registerVoter('V003', 'Michael Johnson');
    this.registerVoter('V004', 'Emily Davis');
    this.registerVoter('V005', 'Robert Wilson');
  }

  registerVoter(id: string, name: string): Voter {
    if (this.voters.has(id)) {
      throw new Error(`Voter with ID ${id} already exists`);
    }

    const voter: Voter = {
      id,
      name,
      registered: true,
      hasVoted: false
    };

    this.voters.set(id, voter);
    return voter;
  }

  getVoter(id: string): Voter | undefined {
    return this.voters.get(id);
  }

  isRegistered(id: string): boolean {
    const voter = this.voters.get(id);
    return voter ? voter.registered : false;
  }

  markAsVoted(id: string): void {
    const voter = this.voters.get(id);
    if (voter) {
      voter.hasVoted = true;
      this.voters.set(id, voter);
    }
  }

  hasVoted(id: string): boolean {
    const voter = this.voters.get(id);
    return voter ? voter.hasVoted : false;
  }

  getAllVoters(): Voter[] {
    return Array.from(this.voters.values());
  }

  getRegisteredVoterCount(): number {
    return Array.from(this.voters.values()).filter(voter => voter.registered).length;
  }

  getVotedCount(): number {
    return Array.from(this.voters.values()).filter(voter => voter.hasVoted).length;
  }
}