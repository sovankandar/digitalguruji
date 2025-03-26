 // Toggle advanced options
 document.getElementById('advancedMode').addEventListener('change', function() {
    const advancedOptions = document.getElementById('advancedOptions');
    advancedOptions.style.display = this.checked ? 'block' : 'none';

    // Add a smooth animation for showing/hiding
    if (this.checked) {
      advancedOptions.style.maxHeight = '0';
      advancedOptions.style.opacity = '0';
      setTimeout(() => {
        advancedOptions.style.transition = 'max-height 0.5s ease, opacity 0.5s ease';
        advancedOptions.style.maxHeight = '500px';
        advancedOptions.style.opacity = '1';
      }, 10);
    } else {
      advancedOptions.style.maxHeight = '0';
      advancedOptions.style.opacity = '0';
      setTimeout(() => {
        advancedOptions.style.display = 'none';
      }, 500);
    }
  });

  function updateStatus(elementId, icon, text, isError = false) {
    const element = document.getElementById(elementId);
    const iconElement = document.getElementById(`${elementId}Icon`);

    element.textContent = text;
    iconElement.textContent = icon;

    if (isError) {
      iconElement.className = 'status-icon status-error';
      element.style.color = 'var(--error)';
    } else {
      iconElement.className = 'status-icon status-success';
      element.style.color = 'var(--success)';
    }
  }

  function displayErrorDetails(containerId, error) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
      <div class="error-details">
        <strong>Error:</strong> ${error.error || 'Unknown error'}<br>
        ${error.details ? `<strong>Details:</strong> ${error.details}` : ''}
      </div>
    `;
  }

  async function testMCP() {
    const mcpUrl = document.getElementById('mcpUrl').value.trim();
    const installationCode = document.getElementById('installationCode').value.trim();
    let testInput = document.getElementById('testInput').value.trim();

    // Reset UI
    document.getElementById('results').style.display = 'block';
    setTimeout(() => {
      document.getElementById('results').classList.add('visible');
    }, 10);

    const connectionIcon = document.getElementById('connectionStatusIcon');
    const connectionStatus = document.getElementById('connectionStatus');
    connectionIcon.className = 'status-icon status-loading';
    connectionIcon.textContent = '⏳';
    connectionStatus.textContent = 'Testing...';

    const functionalityIcon = document.getElementById('functionalityStatusIcon');
    const functionalityStatus = document.getElementById('functionalityStatus');
    functionalityIcon.className = 'status-icon status-loading';
    functionalityIcon.textContent = '⏳';
    functionalityStatus.textContent = 'Testing...';

    document.getElementById('pingDetails').innerHTML = '';
    document.getElementById('testDetails').innerHTML = '';
    document.getElementById('pingResult').textContent = '';
    document.getElementById('testResult').textContent = '';

    // Validate inputs
    if (!mcpUrl || !installationCode) {
      updateStatus('connectionStatus', '❌', 'Missing required fields', true);
      document.getElementById('pingDetails').innerHTML = `
        <div class="error-details">
          Please provide both MCP Server URL and Installation Code
        </div>
      `;
      return;
    }

    // Parse test input (if provided)
    try {
      testInput = testInput ? JSON.parse(testInput) : undefined;
    } catch (e) {
      updateStatus('functionalityStatus', '❌', 'Invalid input', true);
      document.getElementById('testDetails').innerHTML = `
        <div class="error-details">
          Invalid JSON in Test Input field: ${e.message}
        </div>
      `;
      return;
    }

    const button = document.getElementById('testButton');
    button.disabled = true;
    button.textContent = 'Testing...';

    try {
      // For demonstration purposes, we'll simulate a fetch request
      // In a real application, uncomment the fetch code below
      /*
      const response = await fetch('http://localhost:3019/test-mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mcpUrl,
          installationCode,
          testInput
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }
      */

      // Simulate a successful response for demonstration
      await new Promise(resolve => setTimeout(resolve, 2000));
      const data = {
        pingResponse: {
          status: 'connected',
          url: mcpUrl,
          latency: '120ms',
          serverInfo: {
            version: '1.0.2',
            provider: 'Smithery',
            status: 'online'
          }
        },
        testResponse: {
          success: true,
          input: testInput || {"prompt": "Test prompt"},
          output: {
            response: "This is a simulated response from the MCP server",
            metadata: {
              processingTime: "350ms",
              tokens: {
                input: 15,
                output: 42
              }
            }
          }
        }
      };

      // Display successful results
      updateStatus('connectionStatus', '✅', 'Connected successfully');
      updateStatus('functionalityStatus', '✅', 'Test completed successfully');
      document.getElementById('pingDetails').innerHTML = '<div class="success-details">Successfully connected to the MCP server</div>';
      document.getElementById('testDetails').innerHTML = '<div class="success-details">The MCP server processed the request successfully</div>';
      document.getElementById('pingResult').textContent = JSON.stringify(data.pingResponse, null, 2);
      document.getElementById('testResult').textContent = JSON.stringify(data.testResponse, null, 2);
    } catch (error) {
      if (error.error === 'Connection failed' || error.error === 'Connection timeout') {
        updateStatus('connectionStatus', '❌', 'Connection failed', true);
        displayErrorDetails('pingDetails', error);
      } else if (error.error === 'Functionality test failed') {
        updateStatus('connectionStatus', '✅', 'Connected successfully');
        updateStatus('functionalityStatus', '❌', 'Test failed', true);
        displayErrorDetails('testDetails', error);
      } else {
        updateStatus('connectionStatus', '❌', 'Test failed', true);
        displayErrorDetails('pingDetails', error);
      }
    } finally {
      button.disabled = false;
      button.textContent = 'Test MCP Server';
    }
  }