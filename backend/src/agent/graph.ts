import { StateGraph, END } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { AgentState } from "../types.js";
import { tools } from "./tools.js";

// Initialize the LLM
const llm = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0,
});

// Bind tools to the LLM
const llmWithTools = llm.bindTools(tools);

// Define the chat node
async function chatNode(state: AgentState): Promise<Partial<AgentState>> {
  const messages = state.messages.map(msg => {
    if (msg.role === 'user') {
      return new HumanMessage(msg.content);
    } else {
      return new AIMessage(msg.content);
    }
  });

  const response = await llmWithTools.invoke(messages);
  
  // Add the current response to messages
  const currentMessage = {
    id: Date.now().toString(),
    content: response.content as string,
    role: 'assistant' as const,
    timestamp: new Date(),
  };
  
  return {
    currentMessage: response.content as string,
    messages: [currentMessage],
    toolCalls: response.tool_calls?.map((toolCall: any) => ({
      id: toolCall.id,
      name: toolCall.name,
      args: toolCall.args,
    })) || [],
  };
}

// Define the tool execution node
async function toolNode(state: AgentState): Promise<Partial<AgentState>> {
  if (!state.toolCalls || state.toolCalls.length === 0) {
    return {};
  }

  const toolResults = [];
  
  for (const toolCall of state.toolCalls) {
    const tool = tools.find(t => t.name === toolCall.name);
    if (tool) {
      try {
        // Convert args object to string for the tool
        const argsString = typeof toolCall.args === 'string' 
          ? toolCall.args 
          : JSON.stringify(toolCall.args);
        
        const result = await tool._call(argsString);
        toolResults.push({
          ...toolCall,
          result: result,
        });
      } catch (error) {
        toolResults.push({
          ...toolCall,
          result: `Error: ${error}`,
        });
      }
    }
  }

  // Add tool results as messages so the agent can see them
  const toolMessages = toolResults.map(toolCall => ({
    id: `tool-${toolCall.id}`,
    content: `Tool ${toolCall.name} result: ${toolCall.result}`,
    role: 'assistant' as const,
    timestamp: new Date(),
  }));

  return {
    toolCalls: toolResults,
    messages: toolMessages,
  };
}

// Create the graph
export function createAgentGraph() {
  const workflow = new StateGraph<AgentState>({
    channels: {
      messages: {
        reducer: (x: AgentState["messages"], y: AgentState["messages"]) => [...x, ...y],
        default: () => [],
      },
      currentMessage: {
        reducer: (x: AgentState["currentMessage"], y: AgentState["currentMessage"]) => y || x,
        default: () => "",
      },
      toolCalls: {
        reducer: (x: AgentState["toolCalls"], y: AgentState["toolCalls"]) => y || x,
        default: () => [],
      },
    },
  });

  // Add nodes
  workflow.addNode("chat", chatNode);
  workflow.addNode("tools", toolNode);

  // Add edges
  workflow.addEdge("chat", "tools");
  workflow.addConditionalEdges(
    "tools",
    (state: AgentState) => {
      if (state.toolCalls && state.toolCalls.length > 0) {
        return "chat";
      }
      return END;
    }
  );

  // Set entry point
  workflow.setEntryPoint("chat");

  return workflow.compile();
} 