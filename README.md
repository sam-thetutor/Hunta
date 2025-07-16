# LangGraph AI Agent Template

A complete template for building AI agents with LangGraph, featuring both backend and frontend components.

## 🚀 Features

- **LangGraph Backend**: Express server with LangGraph AI agent
- **React Frontend**: Modern chat interface with TypeScript and Tailwind CSS
- **Tool Integration**: Built-in calculator tool as an example
- **Real-time Chat**: Message history and typing indicators
- **Type Safety**: Full TypeScript support
- **Responsive Design**: Works on desktop and mobile

## 📁 Project Structure

```
langgraph-template/
├── backend/                 # LangGraph AI Agent Server
│   ├── src/
│   │   ├── agent/          # LangGraph agent implementation
│   │   ├── routes/         # Express routes
│   │   ├── types.ts        # TypeScript types
│   │   └── server.ts       # Express server
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # React Chat Interface
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- OpenAI API key (or Anthropic API key)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd langgraph-template/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   # or
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The backend will be available at `http://localhost:3001`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd langgraph-template/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## 🎯 Usage

1. Open your browser and go to `http://localhost:5173`
2. Start chatting with the AI agent
3. Try asking for calculations like:
   - "What is 15 * 23?"
   - "Calculate 100 / 4 + 7"
   - "What is 2^10?"

## 🔧 Customization

### Adding New Tools

1. **Create a new tool in `backend/src/agent/tools.ts`:**
   ```typescript
   export class MyCustomTool extends Tool {
     name = "my_tool";
     description = "Description of what this tool does";
     schema = z.object({
       // Define your tool's input schema
     });

     async _call(input: any): Promise<string> {
       // Implement your tool logic
       return "Tool result";
     }
   }
   ```

2. **Add the tool to the tools array:**
   ```typescript
   export const tools = [new CalculatorTool(), new MyCustomTool()];
   ```

### Changing the LLM

You can switch between different LLM providers by modifying `backend/src/agent/graph.ts`:

```typescript
// For OpenAI
const llm = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0,
});

// For Anthropic
const llm = new ChatAnthropic({
  modelName: "claude-3-sonnet-20240229",
  temperature: 0,
});
```

### Styling

The frontend uses Tailwind CSS. You can customize the styling by modifying:
- `frontend/tailwind.config.js` - Tailwind configuration
- `frontend/src/index.css` - Global styles
- Component files - Individual component styles

## 📚 API Endpoints

### POST `/api/chat`

Send a message to the AI agent.

**Request Body:**
```json
{
  "message": "What is 15 * 23?",
  "history": [
    {
      "id": "1",
      "content": "Hello",
      "role": "user",
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Response:**
```json
{
  "message": "The result is 345",
  "toolCalls": [
    {
      "id": "call_123",
      "name": "calculator",
      "args": { "expression": "15 * 23" },
      "result": "Result: 345"
    }
  ]
}
```

### GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🚀 Deployment

### Backend Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

### Frontend Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Serve the built files:**
   ```bash
   npm run preview
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify your API keys are correctly set
3. Ensure both backend and frontend are running
4. Check the network tab for API call errors

## 🔗 Resources

- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [LangChain Documentation](https://js.langchain.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/) 