import { Block, Vote } from '../types/blockchain';

export class Blockchain {
  private chain: Block[] = [];
  private difficulty = 4;

  constructor() {
    // Create genesis block
    this.createBlock({
      voter: 'genesis',
      candidate: 'genesis'
    });
  }

  private async calculateHash(index: number, previousHash: string, timestamp: number, vote: Vote, nonce: number): Promise<string> {
    const data = index + previousHash + timestamp + JSON.stringify(vote) + nonce;
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  async createBlock(vote: Vote): Promise<Block> {
    const previousBlock = this.getLatestBlock() || null;
    const index = previousBlock ? previousBlock.index + 1 : 0;
    const previousHash = previousBlock ? previousBlock.hash : "0";
    const timestamp = Date.now();
    let nonce = 0;
    let hash = await this.calculateHash(index, previousHash, timestamp, vote, nonce);

    // Simple proof of work
    while (hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join("0")) {
      nonce++;
      hash = await this.calculateHash(index, previousHash, timestamp, vote, nonce);
    }

    const block: Block = {
      index,
      timestamp,
      vote,
      previousHash,
      hash,
      nonce
    };

    this.chain.push(block);
    return block;
  }

  async isChainValid(): Promise<boolean> {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }

      const hash = await this.calculateHash(
        currentBlock.index,
        currentBlock.previousHash,
        currentBlock.timestamp,
        currentBlock.vote,
        currentBlock.nonce
      );

      if (currentBlock.hash !== hash) {
        return false;
      }
    }
    return true;
  }

  getChain(): Block[] {
    return this.chain;
  }

  hasVoted(voter: string): boolean {
    return this.chain.some(block => block.vote.voter === voter);
  }

  getVoteCount(): Record<string, number> {
    const counts: Record<string, number> = {};
    this.chain.forEach(block => {
      if (block.vote.candidate !== 'genesis') {
        counts[block.vote.candidate] = (counts[block.vote.candidate] || 0) + 1;
      }
    });
    return counts;
  }
}