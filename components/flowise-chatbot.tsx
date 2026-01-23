'use client';

import { useEffect } from 'react';

interface FlowiseChatbotProps {
  chatflowId: string;
  apiHost: string;
}

export default function FlowiseChatbot({ chatflowId, apiHost }: FlowiseChatbotProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = `
      import Chatbot from 'https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js';
      Chatbot.init({
        chatflowid: '${chatflowId}',
        apiHost: '${apiHost}',
        theme: {
          button: {
            backgroundColor: '#3B81F6',
            right: 20,
            bottom: 20,
            size: 'medium',
            dragAndDrop: true,
            iconColor: 'white',
          },
          chatWindow: {
            showTitle: true,
            title: 'Shop Assistant',
            welcomeMessage: 'Hi! How can I help you find the perfect product today?',
            backgroundColor: '#ffffff',
            height: 600,
            width: 400,
            fontSize: 16,
            starterPrompts: [
              'Show me skincare products',
              'What are your best sellers?',
              'Help me find a gift'
            ],
            botMessage: {
              backgroundColor: '#f7f8ff',
              textColor: '#303235',
              showAvatar: true,
            },
            userMessage: {
              backgroundColor: '#3B81F6',
              textColor: '#ffffff',
              showAvatar: true,
            },
            textInput: {
              placeholder: 'Ask about our products...',
              backgroundColor: '#ffffff',
              textColor: '#303235',
              sendButtonColor: '#3B81F6',
            },
          },
        },
      });
    `;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [chatflowId, apiHost]);

  return null;
}