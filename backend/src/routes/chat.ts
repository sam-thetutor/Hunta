import { Router } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { createAgentGraph } from '../agent/graph.js';
import { ChatRequest, ChatResponse, ChatMessage } from '../types.js';

const router = Router();

// Initialize the agent graph
const agentGraph = createAgentGraph();

router.post('/chat', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { message, history = [] }: ChatRequest = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Convert history to the format expected by the agent
    const messages: ChatMessage[] = [
      ...history,
      {
        id: Date.now().toString(),
        content: message,
        role: 'user',
        timestamp: new Date(),
      }
    ];

    // Add user context to the message for swap tools
    const userContext = `User ID: ${req.user?.id}, User Public Key: ${req.user?.publicKey}`;
    const messageWithContext = `${message}\n\nUser Context: ${userContext}`;

    // Run the agent
    const result = await agentGraph.invoke({
      messages: [
        ...messages.slice(0, -1),
        {
          ...messages[messages.length - 1],
          content: messageWithContext
        }
      ],
      currentMessage: '',
      toolCalls: [],
      userId: req.user?.id, // Pass user ID for swap tools
    });

    // Create response
    const response: ChatResponse = {
      message: result.currentMessage || 'No response generated',
      toolCalls: result.toolCalls,
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