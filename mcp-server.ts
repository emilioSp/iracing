import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { readFileSync } from 'node:fs';
import { documentation, member, team } from './src/index.js';
import { storage } from './storage.js';

const app = express();
app.use(cors());
app.use(express.json());

// MCP protocol version
const MCP_VERSION = '0.3.0';

// Initialize auth cookie
if (!process.env.COOKIE_JAR) {
  throw new Error('COOKIE_JAR environment variable is not set');
}

const authCookie = readFileSync(process.env.COOKIE_JAR, 'utf8');

// Validate request body for MCP protocol
function validateMCPRequest(req: Request, res: Response, next: NextFunction): void {
  const { arguments: args } = req.body;
  
  if (!args || typeof args !== 'object') {
    res.status(400).json({
      type: 'error',
      error: 'Invalid request format. Expected "arguments" object in request body.'
    });
    return;
  }
  
  next();
}

// MCP protocol endpoints
app.get('/', (req: Request, res: Response) => {
  res.json({
    schema_version: MCP_VERSION,
    implementation_name: 'iracing-mcp',
    implementation_version: '1.0.0',
    description: 'iRacing API MCP Server',
    suggestions: [
      'Use /documentation to get API documentation',
      'Use /member to get member information',
      'Use /team to get team information'
    ],
    auth_scheme: 'none',
    capabilities: ['iracing_api'],
    rate_limit: 60, // requests per minute
    rate_limit_period_seconds: 60
  });
});

// Documentation endpoint
app.post('/documentation', validateMCPRequest, async (req: Request, res: Response) => {
  try {
    await storage.run({ authCookie }, async () => {
      const result = await documentation();
      res.json({
        type: 'success',
        value: result
      });
    });
  } catch (error) {
    res.status(500).json({
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Member endpoint
app.post('/member', validateMCPRequest, async (req: Request, res: Response) => {
  try {
    await storage.run({ authCookie }, async () => {
      const result = await member();
      res.json({
        type: 'success',
        value: result
      });
    });
  } catch (error) {
    res.status(500).json({
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Team endpoint
app.post('/team', validateMCPRequest, async (req: Request, res: Response) => {
  try {
    await storage.run({ authCookie }, async () => {
      const result = await team();
      res.json({
        type: 'success',
        value: result
      });
    });
  } catch (error) {
    res.status(500).json({
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    type: 'error',
    error: 'Internal server error'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`iRacing MCP server running on port ${PORT}`);
  console.log(`Server ready for Claude at http://localhost:${PORT}`);
}); 