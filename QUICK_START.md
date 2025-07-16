# 🚀 Quick Start Guide

Get your LangGraph AI Agent up and running in minutes!

## Prerequisites

- Node.js 18+ installed
- OpenAI API key (or Anthropic API key)

## 1. Setup (One Command)

```bash
./setup.sh
```

This will:
- ✅ Install all dependencies
- ✅ Create environment files
- ✅ Set up both backend and frontend

## 2. Configure API Keys

Edit `backend/.env`:
```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
FRONTEND_URL=http://localhost:5173
```

## 3. Start the Application

### Option A: Start Both (Recommended)
```bash
npm run dev
```

### Option B: Start Separately
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend  
npm run dev:frontend
```

## 4. Open Your Browser

Go to: **http://localhost:5173**

## 5. Test the Agent

Try these example messages:
- "What is 15 * 23?"
- "Calculate 100 / 4 + 7"
- "What is 2^10?"

## 🎯 What You'll See

- **Modern Chat Interface**: Clean, responsive design
- **Real-time Responses**: Live typing indicators
- **Tool Integration**: Calculator tool with visual feedback
- **Message History**: Persistent conversation flow
- **Error Handling**: Clear error messages

## 🔧 Troubleshooting

### Backend Issues
- Check if port 3001 is available
- Verify API key is set correctly
- Check console for error messages

### Frontend Issues  
- Ensure backend is running on port 3001
- Check browser console for errors
- Verify CORS settings

### Common Errors
- **"Module not found"**: Run `npm install` in the respective directory
- **"API key invalid"**: Check your `.env` file
- **"Connection refused"**: Ensure backend is running

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Add custom tools in `backend/src/agent/tools.ts`
- Customize the UI in `frontend/src/components/`
- Deploy to production

---

**Need help?** Check the main [README.md](README.md) for comprehensive documentation. 