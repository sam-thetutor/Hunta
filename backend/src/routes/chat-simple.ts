import { Router } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

router.post('/chat', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Simple response for testing
    const response = {
      message: `Echo: ${message}`,
      toolCalls: [],
    };

    res.json(response);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 