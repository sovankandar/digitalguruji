const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3019;

app.use(cors());
app.use(express.json());

// Enhanced MCP testing endpoint
app.post('/test-mcp', async (req, res) => {
  try {
    const { mcpUrl, installationCode, testInput } = req.body;
    
    // Validate URL format
    if (!mcpUrl.match(/^https?:\/\/.+/i)) {
      return res.status(400).json({ 
        error: 'Invalid URL format',
        details: 'Please include http:// or https:// prefix'
      });
    }

    // Verify the MCP server is reachable
    let pingResponse;
    try {
      pingResponse = await axios.get(`${mcpUrl}/ping`, { timeout: 5000 });
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        return res.status(408).json({ 
          error: 'Connection timeout',
          details: 'The MCP server did not respond within 5 seconds'
        });
      }
      return res.status(400).json({ 
        error: 'Connection failed',
        details: error.message
      });
    }

    if (pingResponse.status !== 200 || pingResponse.data?.status !== 'ok') {
      return res.status(400).json({ 
        error: 'Invalid ping response',
        details: 'The /ping endpoint did not return a valid response'
      });
    }

    // Test the MCP functionality
    let testResponse;
    try {
      testResponse = await axios.post(`${mcpUrl}/execute`, {
        installation_code: installationCode,
        input: testInput || { prompt: "Test input for MCP server" }
      }, { timeout: 10000 });
    } catch (error) {
      return res.status(400).json({
        error: 'Functionality test failed',
        details: error.response?.data || error.message
      });
    }

    res.json({
      status: 'success',
      pingResponse: pingResponse.data,
      testResponse: testResponse.data
    });
  } catch (error) {
    console.error('Error testing MCP server:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`MCP Tester backend running on http://localhost:${port}`);
});