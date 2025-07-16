export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  toolCalls?: ToolCall[];
}

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, any>;
  result?: any;
}

export interface ChatRequest {
  message: string;
  history?: ChatMessage[];
}

export interface ChatResponse {
  message: string;
  toolCalls?: ToolCall[];
  error?: string;
} 