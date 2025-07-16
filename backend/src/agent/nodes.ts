import { StateGraph, END } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { HumanMessage, AIMessage, ToolMessage } from "@langchain/core/messages";
import { AgentState } from "../types.js";
import { tools } from "./tools.js";

// Initialize the LLM
const llm = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0,
});

// Alternative: Use Anthropic Claude
// const llm = new ChatAnthropic({
//   modelName: "claude-3-sonnet-20240229",
//   temperature: 0,
// });

// Bind tools to the LLM
const llmWithTools = llm.bindTools(tools);

// Define the chat node
async function chatNode(state: AgentState): Promise<Partial<AgentState>> {
  const messages = state.messages.map(msg => {
    if (msg.role === 'user') {
      return new HumanMessage(msg.content);
    } else if (msg.role === 'assistant') {
      return new AIMessage(msg.content);
    }
    return new ToolMessage(msg.content, msg.toolCalls?.[0]?.id || '');
  });

  const response = await llmWithTools.invoke(messages);
  
  return {
    currentMessage: response.content as string,
    toolCalls: response.tool_calls?.map(toolCall => ({
      id: toolCall.id || `tool-${Date.now()}-${Math.random()}`,
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
        const result = await tool.invoke(toolCall.args);
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

  return {
    toolCalls: toolResults,
  };
}

// Define the final response node
async function finalResponseNode(state: AgentState): Promise<Partial<AgentState>> {
  if (!state.toolCalls || state.toolCalls.length === 0) {
    return {};
  }

  const toolMessages = state.toolCalls.map(toolCall => 
    new ToolMessage(toolCall.result, toolCall.id)
  );

  const messages = state.messages.map(msg => {
    if (msg.role === 'user') {
      return new HumanMessage(msg.content);
    } else if (msg.role === 'assistant') {
      return new AIMessage(msg.content);
    }
    return new ToolMessage(msg.content, msg.toolCalls?.[0]?.id || '');
  });

  const response = await llm.invoke([...messages, ...toolMessages]);
  
  return {
    currentMessage: response.content as string,
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
  workflow.addNode("final_response", finalResponseNode);

  // Add edges
  workflow.addEdge("chat" as any, "tools" as any);
  workflow.addConditionalEdges(
    "tools" as any,
    (state) => {
      if (state.toolCalls && state.toolCalls.length > 0) {
        return "final_response";
      }
      return END;
    }
  );
  workflow.addEdge("final_response" as any, END);

  // Set entry point
  workflow.setEntryPoint("chat" as any);

  return workflow.compile();
} 