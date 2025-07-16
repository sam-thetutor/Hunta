import { Tool } from '@langchain/core/tools';
import {
  GetTokensTool,
  GetProtocolsTool,
  GetPoolsTool,
  GetContractAddressesTool,
  GetQuoteTool,
  ExecuteSwapTool,
  SendTransactionTool,
  GetSwapStatusTool,
  GetSwapHistoryTool,
  GetTokenPriceTool
} from './tools/soroswap.js';

export class CalculatorTool extends Tool {
  name = "calculator";
  description = "A simple calculator that can perform basic arithmetic operations (+, -, *, /, ^)";

  async _call(input: string): Promise<string> {
    try {
      // Handle both string input and JSON input from LangChain
      let expression: string;
      try {
        const parsed = JSON.parse(input);
        expression = parsed.input || parsed.expression || input;
      } catch {
        expression = input;
      }
      
      // Parse the input as a mathematical expression
      expression = expression.replace(/[^0-9+\-*/().^]/g, '');
      
      // Basic validation
      if (!/^[0-9+\-*/().^ ]+$/.test(expression)) {
        return "Error: Invalid characters in expression";
      }

      // Replace ^ with ** for exponentiation
      const jsExpression = expression.replace(/\^/g, '**');
      
      // Evaluate the expression
      const result = eval(jsExpression);
      
      if (isNaN(result) || !isFinite(result)) {
        return "Error: Invalid mathematical expression";
      }

      return `Result: ${result}`;
    } catch (error) {
      return `Error evaluating expression: ${error}`;
    }
  }
}

export class WeatherTool extends Tool {
  name = "weather";
  description = "Get current weather information for a location (mock data for demo)";

  async _call(input: string): Promise<string> {
    try {
      // Handle both string input and JSON input from LangChain
      let location: string;
      try {
        const parsed = JSON.parse(input);
        location = parsed.input || parsed.location || input;
      } catch {
        location = input;
      }
      
      location = location.trim();
      
      // Mock weather data - in a real implementation, you'd call a weather API
      const mockWeatherData = {
        "new york": { temp: "22°C", condition: "Partly Cloudy", humidity: "65%" },
        "london": { temp: "15°C", condition: "Rainy", humidity: "80%" },
        "tokyo": { temp: "28°C", condition: "Sunny", humidity: "55%" },
        "sydney": { temp: "18°C", condition: "Clear", humidity: "70%" },
        "paris": { temp: "20°C", condition: "Cloudy", humidity: "75%" }
      };

      const normalizedLocation = location.toLowerCase();
      const weather = mockWeatherData[normalizedLocation as keyof typeof mockWeatherData];

      if (weather) {
        return `Weather in ${location}: ${weather.temp}, ${weather.condition}, Humidity: ${weather.humidity}`;
      } else {
        return `Weather data not available for ${location}. Available cities: New York, London, Tokyo, Sydney, Paris`;
      }
    } catch (error) {
      return `Error getting weather: ${error}`;
    }
  }
}

// Registry of all available tools
export const tools: Tool[] = [
  // Soroswap tools
  new GetTokensTool(),
  new GetProtocolsTool(),
  new GetPoolsTool(),
  new GetContractAddressesTool(),
  new GetQuoteTool(),
  new ExecuteSwapTool(),
  new SendTransactionTool(),
  new GetSwapStatusTool(),
  new GetSwapHistoryTool(),
  new GetTokenPriceTool(),
];

// Export individual tools for specific use cases
export {
  GetTokensTool,
  GetProtocolsTool,
  GetPoolsTool,
  GetContractAddressesTool,
  GetQuoteTool,
  ExecuteSwapTool,
  SendTransactionTool,
  GetSwapStatusTool,
  GetSwapHistoryTool,
  GetTokenPriceTool
}; 