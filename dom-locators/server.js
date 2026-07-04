/**
 * Express Server for DOM to Playwright Locators Converter
 * Provides REST API and web interface
 */

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const DOMToPlaywrightLocators = require('./index');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static('public'));

// Routes

/**
 * GET /
 * Serve HTML interface
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * POST /api/generate
 * Generate locators from DOM HTML
 * Body: { html: "..." }
 */
app.post('/api/generate', (req, res) => {
  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({ error: 'HTML content required' });
    }

    const generator = new DOMToPlaywrightLocators(html);
    const result = generator.toJSON();

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/generate/code
 * Generate Playwright test code
 * Body: { html: "..." }
 */
app.post('/api/generate/code', (req, res) => {
  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({ error: 'HTML content required' });
    }

    const generator = new DOMToPlaywrightLocators(html);
    const code = generator.generatePlaywrightCode();

    res.json({
      success: true,
      code: code,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/generate/json
 * Get JSON format only
 * Body: { html: "..." }
 */
app.post('/api/generate/json', (req, res) => {
  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({ error: 'HTML content required' });
    }

    const generator = new DOMToPlaywrightLocators(html);
    const elements = generator.extractInteractiveElements();

    res.json({
      success: true,
      elements: elements,
      total: elements.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║  DOM to Playwright Locators Generator         ║
║  Running on: http://localhost:${PORT}         ║
║                                                ║
║  API Endpoints:                                ║
║  POST /api/generate      - Generate locators  ║
║  POST /api/generate/code - Generate test code ║
║  POST /api/generate/json - Get JSON output    ║
╚════════════════════════════════════════════════╝
  `);
});
