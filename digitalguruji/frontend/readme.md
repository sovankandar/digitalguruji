Prerequisites
Node.js (v14 or higher)

npm (comes with Node.js)

Modern web browser

Installation
Clone the repository or download the source files:


git clone https://github.com/your-repo/mcp-tester.git
cd mcp-tester
Install dependencies:


npm install express axios cors
Running the Application
Start the backend server:


node server.js
Open your web browser and navigate to:


http://localhost:3001
The application should now be ready to use.

Usage Guide
Enter MCP Server Details:

Server URL (e.g., https://your-mcp-server.com)

Installation code (from marketplace)

Provide Test Input:

Enter JSON formatted input appropriate for your MCP server

Use the examples below for inspiration

Run the Test:

Click "Test MCP Server"

View results in the output panel

Example Inputs

Text Processing MCP

{
  "prompt": "Explain quantum computing to a 5-year-old",
  "max_length": 200
}
Data Analysis MCP

{
  "dataset": [15, 22, 18, 30, 25],
  "operations": ["mean", "median"]
}
Translation MCP

{
  "text": "Hello world",
  "source": "en",
  "target": "es"
}

Backend Architecture
The backend is built with Node.js and Express, handling these key responsibilities:

Request Validation:

Verifies URL formatting

Validates JSON input structure

Implements timeout safeguards

MCP Communication:

First pings the server to verify availability

Then sends a test request with the provided input

Processes responses for frontend display

Error Handling:

Catches network errors

Handles malformed responses

Provides detailed error information

Frontend Design
The responsive frontend interface features:

Input Validation:

Real-time JSON syntax checking

Required field validation

Result Visualization:

Color-coded status indicators

Expandable response sections

Syntax-highlighted JSON display

User Experience:

Clear status updates during testing

Helpful error explanations

Suggested next steps for troubleshooting

Troubleshooting
Common Issues
Connection Errors:

Verify the MCP server URL is correct

Check your network connectivity

Ensure the server is running

Invalid Input Errors:

Confirm your JSON is properly formatted

Verify the input matches the MCP's expected schema

Check the MCP server documentation

Timeout Errors:

The server may be overloaded

Try again later

Contact the MCP provider if persistent