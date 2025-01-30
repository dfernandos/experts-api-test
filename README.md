# Expert Recency API Testing

## Project Overview
This project is focused on API testing for the expert filtering system, specifically testing the **recency** filter. The recency filter determines experts based on the number of months since they last worked for a company.

## Prerequisites
Ensure you have the following dependencies installed before running the tests:

- Node.js (Latest LTS version recommended)
- npm or yarn
- Mocha, Chai, Sinon for testing
- Experts api 

### Install dependencies
```sh
npm install
```

## How to Run the Tests
The test suite uses Mocha as the test runner. You can execute the tests using the following command:

```sh
npm test
```

## Test Cases
The test suite includes the following cases:

1. **Filtering experts prior to a year**
   - Validates that only experts who last worked more than 12 months ago are returned.

2. **Filtering experts from one year to two**
   - Ensures that only experts who last worked between 12 and 24 months ago are included.

3. **Filtering experts from now to 6 months**
   - Checks that only experts who last worked within the last 6 months are returned.

## API Request Structure
The API expects a POST request to filter experts based on recency. The request structure is as follows:

```json
{
  "filters": {
    "status": [],
    "groups": [],
    "recency": ["{{timeframe}}"]
  }
}
```

### Example Filters
```json
">12"  // Experts who last worked more than 12 months ago
"[12,24]"  // Experts who last worked between 12 and 24 months ago
"<6"  // Experts who last worked within the last 6 months
```

## Test Implementation
The tests are written using **Mocha, Chai, and Sinon** and mock API responses to validate correct filtering behavior.

### Technologies Used
- **Mocha**: Test runner
- **Chai**: Assertion library
- **Sinon**: Stubbing and mocking library

