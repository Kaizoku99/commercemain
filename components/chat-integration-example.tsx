'use client';

import { useState } from 'react';
import CustomChat from './custom-chat';
import FlowiseChatbot from './flowise-chatbot';

export default function ChatIntegrationExample() {
  const [chatType, setChatType] = useState<'embedded' | 'custom'>('embedded');
  
  const chatflowId = process.env.NEXT_PUBLIC_FLOWISE_CHATFLOW_ID || '';
  const apiHost = process.env.NEXT_PUBLIC_FLOWISE_API_HOST || '';

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Flowise Chatbot Integration</h2>
      
      {/* Toggle between chat types */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setChatType('embedded')}
            className={`px-4 py-2 rounded-md ${
              chatType === 'embedded'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Embedded Widget
          </button>
          <button
            onClick={() => setChatType('custom')}
            className={`px-4 py-2 rounded-md ${
              chatType === 'custom'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Custom Chat
          </button>
        </div>
      </div>

      {/* Chat Implementation */}
      {chatType === 'embedded' ? (
        <div>
          <h3 className="text-lg font-semibold mb-4">Embedded Flowise Widget</h3>
          <p className="text-gray-600 mb-4">
            The embedded widget will appear as a floating chat button in the bottom-right corner.
          </p>
          <FlowiseChatbot chatflowId={chatflowId} apiHost={apiHost} />
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold mb-4">Custom Chat Interface</h3>
          <CustomChat 
            chatflowId={chatflowId}
            sessionId="demo-session"
            className="max-w-md mx-auto"
          />
        </div>
      )}

      {/* Integration Tips */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2">Integration Tips:</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
          <li>Configure your Flowise chatflow with Shopify product data</li>
          <li>Use the OpenAPI Toolkit to connect to your Shopify API</li>
          <li>Set up conversation memory for better user experience</li>
          <li>Customize the chat theme to match your brand</li>
          <li>Add product recommendation capabilities</li>
        </ul>
      </div>
    </div>
  );
}