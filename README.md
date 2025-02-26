# Blockchain Voting System

A secure and transparent voting application powered by blockchain technology.

![Blockchain Voting System]

## Features

- **Blockchain-Based**: All votes are recorded on a blockchain for transparency and immutability
- **Secure Voting**: Implements proof-of-work algorithm for vote validation
- **Voter Verification**: Includes a voter database to verify eligible voters
- **Real-time Results**: View voting results as they come in
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- React with TypeScript
- Tailwind CSS for styling
- Web Crypto API for secure hashing
- Lucide React for icons

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Meghavardhan-ops/Blockchain-Voting-System-Implementation.git
   cd blockchain-voting-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## How to Use

1. Enter a voter ID (sample IDs: V001-V005)
2. Click "Verify" to check your voter eligibility
3. Select a candidate
4. Click "Cast Vote" to record your vote on the blockchain
5. View the results in real-time

## Project Structure

```
blockchain-voting-system/
├── src/
│   ├── types/
│   │   └── blockchain.ts    # Type definitions
│   ├── utils/
│   │   ├── blockchain.ts    # Blockchain implementation
│   │   └── voterDatabase.ts # Voter management
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── public/
│   └── vite.svg            # Favicon
└── ...configuration files
```

## How It Works

### Blockchain Implementation

The application uses a simple blockchain implementation with the following features:

- Each block contains a single vote
- Blocks are linked through cryptographic hashes
- A proof-of-work algorithm ensures the integrity of the chain
- The Web Crypto API is used for secure hash generation

### Voter Database

- Pre-registered voters with unique IDs
- Verification system to prevent duplicate voting
- Tracking of voter participation

## License

This project is licensed under the MIT License - see the LICENSE file for details.
