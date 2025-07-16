import { Router } from 'express';
import { createAgentGraph } from '../agent/graph.js';
import { ChatRequest, ChatResponse, ChatMessage } from '../types.js';

const router = Router();

// Initialize the agent graph
const agentGraph = createAgentGraph();

router.post('/chat', async (req, res) => {
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

    // Run the agent
    const result = await agentGraph.invoke({
      messages,
      currentMessage: '',
      toolCalls: [],
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