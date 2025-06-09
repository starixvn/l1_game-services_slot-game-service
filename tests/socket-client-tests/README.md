# Socket Client Testing Suite

A comprehensive testing suite for the slot game service socket implementation, including support for both basic betting flows and promotion testing (free spins and bonus games).

## Overview

This testing suite is built using practical data from the `sc-game-service-integration-utils` package and provides:

-   **Basic Betting Tests**: Standard betting flow validation
-   **Multiple Bet Size Testing**: Testing various bet configurations
-   **Promotion Testing**: Free spins and bonus game validation
-   **Game Configuration Testing**: Validation of game setup and user data
-   **Environment Support**: Both local development and IGT testing environments

## Files Structure

```
tests/socket-client-tests/
├── README.md                 # This file
├── package.json             # Dependencies and scripts
├── index.js                 # Main test runner
├── config.js                # Configuration and test data
├── SocketTestClient.js      # Enhanced socket client class
├── basicBetting.test.js     # Basic betting flow tests
└── promotions.test.js       # Promotion-specific tests
```

## Prerequisites

1. **Node.js** (v14 or higher)
2. **Game Server** running on appropriate port:
    - Local: `localhost:5000` for development
    - IGT: `localhost:5002` for controlled testing
3. **Dependencies** from `sc-game-service-integration-utils`

## Installation

From the project root directory:

```bash
cd tests/socket-client-tests
npm install
```

Or install dependencies manually:

```bash
npm install socket.io-client axios sc-game-service-integration-utils
```

## Usage

### Running All Tests

```bash
# Run all available tests on local environment
node index.js local

# Run all tests including promotions on IGT environment
node index.js igt
```

### Running Individual Test Suites

```bash
# Basic betting tests only
npm run test:basic:local
npm run test:basic:igt

# Promotion tests only (requires IGT environment)
npm run test:promotions:igt
```

### Using NPM Scripts

```bash
# All tests on local
npm run test:local

# All tests on IGT
npm run test:igt

# Individual test suites
npm run test:basic
npm run test:promotions
```

## Test Environments

### Local Environment

-   **Server URL**: `http://localhost:5000/user/classicslot`
-   **Use Case**: Development and basic functionality testing
-   **Features**: Basic betting, game configuration validation
-   **Limitations**: Cannot test promotions with predetermined results

### IGT Environment

-   **Server URL**: `http://localhost:5002/user/classicslot`
-   **Use Case**: Comprehensive testing with controlled results
-   **Features**: All tests including promotion testing
-   **Special**: Allows setting predetermined game results via IGT API

## Test Data

The testing suite uses practical data from `sc-game-service-integration-utils`:

### Test Users

-   **normalUser**: Standard test user for regular betting
-   **errorUser**: User for testing error scenarios
-   **botUser1**: Bot user for automated testing

### Bet Configurations

-   **smallBet**: 0.1 per payline on all 25 paylines
-   **mediumBet**: 1.0 per payline on all 25 paylines
-   **largeBet**: 5.0 per payline on all 25 paylines
-   **singlePayline**: 0.1 on single payline
-   **fivePaylines**: 0.1 on first 5 paylines

### Predefined Results (IGT Only)

-   **freeSpins**: Result that triggers free spins
-   **bonus**: Result that triggers bonus game
-   **normal**: Standard result with no promotions
-   **bigWin**: Result with high winnings
-   **smallWin**: Result with modest winnings

## Socket Client Features

The `SocketTestClient` class extends `GameClientDriver` from `sc-game-service-integration-utils` and provides:

### Enhanced Event Handling

-   Automatic connection and sign-in management
-   Game-specific event processing
-   Comprehensive event logging with emojis
-   Error handling and timeout management

### Betting Features

-   Automated bet placement with validation
-   Result analysis and RTP calculation
-   Bet amount verification
-   Payline and amount calculations

### Promotion Support

-   Free spin detection and processing
-   Bonus game chest opening
-   Promotion result tracking
-   Win amount aggregation

### Validation Methods

-   Game configuration validation
-   User data verification
-   Expected vs actual bet amount checking
-   RTP calculation and analysis

## Test Outputs

### Basic Betting Test Output

```
🎮 === BASIC BETTING TEST ===
Environment: local

📡 Step 1: Connecting to server...
✅ Connected to server

🔐 Step 2: Waiting for sign-in...
Sign-in successful!

🎮 Step 3: Joining game...

📋 Step 4: Waiting for game configuration...
Available bet levels: [0.1, 1, 5, 10]
User balance: 20000
User currency: $US

🎲 Step 5: Placing small bet...
Betting 0.1 per payline on 25 paylines
Expected total bet amount: 2.5

⏳ Step 6: Waiting for bet result...
Bet processed successfully

🏁 Step 7: Waiting for final result...

📊 Bet Analysis: {
  betAmount: 2.5,
  winAmount: 1.2,
  netResult: -1.3,
  freeSpins: 0,
  bonus: 0,
  byFreeSpin: false,
  winningPaylines: [1, 5, 12]
}

RTP for this bet: 48.00%

✅ Basic betting test completed successfully!
🔌 Disconnected from server
```

### Promotion Test Output

```
🎰 === FREE SPINS PROMOTION TEST ===
Environment: igt

🎯 Setting up free spins result...
✅ Game result set successfully

📡 Connecting and joining game...
✅ Connected to server
🔐 Signed in: { success: true }
🎮 In game data received

🎲 Placing bet to trigger free spins...
🎉 Free spins triggered! Count: 10

🎰 Processing free spin 1/10...
Free spin 1 win: 2.4

🎰 Processing free spin 2/10...
Free spin 2 win: 1.8

... (additional free spins)

💰 Total free spin winnings: 24.6
Total wins (including trigger): 27.1
```

## Error Handling

The test suite includes comprehensive error handling:

-   **Connection Timeouts**: 10-second timeout for socket connections
-   **Event Timeouts**: Configurable timeouts for different event types
-   **Validation Errors**: Automatic validation of game data and results
-   **Network Errors**: Proper handling of network connectivity issues
-   **IGT API Errors**: Specific error messages for IGT result setting failures

## Configuration Options

### Timeouts (in config.js)

```javascript
export const TIMEOUTS = {
    CONNECTION: 10000, // Socket connection timeout
    EVENT_WAIT: 5000, // General event timeout
    BET_RESULT: 8000, // Bet processing timeout
    BONUS_RESULT: 3000, // Bonus result timeout
};
```

### Expected Game Configuration

```javascript
export const EXPECTED_GAME_CONFIG = {
    betLevels: [0.1, 1, 5, 10],
    paylineCount: 25,
    symbolCount: 11,
    minBetAmount: 0.1,
    maxBetAmount: 10,
};
```

## Troubleshooting

### Common Issues

1. **Connection Failed**

    ```
    ❌ Connection error: Error: xhr poll error
    ```

    - Ensure the game server is running on the correct port
    - Check firewall settings
    - Verify the socket URL in config.js

2. **IGT API Connection Failed**

    ```
    ❌ Cannot connect to IGT API - make sure the server is running on port 5002
    ```

    - Ensure IGT server is running
    - Check if port 5002 is accessible
    - Verify IGT API endpoints are available

3. **Game Configuration Mismatch**

    ```
    ⚠️ Bet levels don't match expected configuration
    ```

    - Update EXPECTED_GAME_CONFIG in config.js
    - Check if game configuration has changed
    - Verify server is returning correct game data

4. **Promotion Tests Not Working**
    ```
    ❌ Free spins were not triggered
    ```
    - Ensure using IGT environment
    - Check if predefined results are set correctly
    - Verify IGT API is working properly

### Debug Mode

To enable more verbose logging, modify the socket connection options:

```javascript
// In SocketTestClient.js, add debug option
this.socket = io(socketOptions.socketUri, {
    ...options,
    debug: true,
    forceNew: true,
});
```

## Contributing

When adding new tests:

1. Follow the existing pattern of async functions with try/catch blocks
2. Use descriptive console.log messages with emojis for better readability
3. Include proper error handling and cleanup (disconnect)
4. Add appropriate timeouts for different operations
5. Validate results and provide meaningful feedback

## Integration with CI/CD

The test suite returns appropriate exit codes:

-   `0`: All tests passed
-   `1`: One or more tests failed or crashed

Example CI/CD usage:

```bash
# Run basic tests
npm run test:basic:local || exit 1

# Run comprehensive tests in IGT environment
npm run test:igt || exit 1
```

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Verify server connectivity and configuration
3. Review console output for specific error messages
4. Check the game server logs for additional context
