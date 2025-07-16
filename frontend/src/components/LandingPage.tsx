import React from 'react';
import { Bot, TrendingUp, Activity, Shield, ArrowRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="bg-primary-600 p-4 rounded-full">
              <Bot className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-primary-600">Hunta</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Your AI-powered DeFi companion for hunting liquidity opportunities and balancing portfolios across the Stellar ecosystem.
          </p>
          <p className="text-lg text-gray-500">
            Connect your Stellar wallet to get started
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="bg-blue-100 p-3 rounded-lg w-fit mx-auto mb-4">
              <Bot className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Assistant</h3>
            <p className="text-gray-600">
              Chat with Hunta to analyze DeFi opportunities, get trading insights, and execute strategies.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="bg-green-100 p-3 rounded-lg w-fit mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Portfolio Management</h3>
            <p className="text-gray-600">
              Track your investments, monitor performance, and get automated rebalancing recommendations.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="bg-purple-100 p-3 rounded-lg w-fit mx-auto mb-4">
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Trading</h3>
            <p className="text-gray-600">
              Execute trades with AI assistance, find arbitrage opportunities, and optimize your DeFi strategies.
            </p>
          </div>
        </div>

        {/* Supported Platforms */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Powered by Stellar DeFi
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-orange-100 p-4 rounded-lg mb-3">
                <div className="w-8 h-8 bg-orange-500 rounded mx-auto"></div>
              </div>
              <h4 className="font-medium text-gray-900">Soroswap</h4>
              <p className="text-sm text-gray-600">DEX & Aggregator</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-lg mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded mx-auto"></div>
              </div>
              <h4 className="font-medium text-gray-900">DeFindex</h4>
              <p className="text-sm text-gray-600">Yield Strategies</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-lg mb-3">
                <div className="w-8 h-8 bg-green-500 rounded mx-auto"></div>
              </div>
              <h4 className="font-medium text-gray-900">Stellar</h4>
              <p className="text-sm text-gray-600">Blockchain</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-lg mb-3">
                <div className="w-8 h-8 bg-purple-500 rounded mx-auto"></div>
              </div>
              <h4 className="font-medium text-gray-900">AI</h4>
              <p className="text-sm text-gray-600">Intelligence</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 