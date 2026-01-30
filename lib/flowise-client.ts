interface FlowiseMessage {
  role: 'userMessage' | 'apiMessage';
  content: string;
}

interface FlowiseResponse {
  text: string;
  sourceDocuments?: any[];
  question: string;
  chatId: string;
}

interface FlowiseConfig {
  sessionId?: string;
  temperature?: number;
  maxTokens?: number;
  returnSourceDocuments?: boolean;
}

export class FlowiseClient {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string, apiKey?: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  async sendMessage(
    chatflowId: string,
    question: string,
    history?: FlowiseMessage[],
    config?: FlowiseConfig
  ): Promise<FlowiseResponse> {
    const url = `${this.baseUrl}/api/v1/prediction/${chatflowId}`;
    
    const payload: any = {
      question,
      streaming: false,
    };

    if (history && history.length > 0) {
      payload.history = history;
    }

    if (config) {
      payload.overrideConfig = config;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Flowise API error:', error);
      throw error;
    }
  }

  async sendMessageStream(
    chatflowId: string,
    question: string,
    history?: FlowiseMessage[],
    config?: FlowiseConfig
  ): Promise<ReadableStream<string>> {
    const url = `${this.baseUrl}/api/v1/prediction/${chatflowId}`;
    
    const payload: any = {
      question,
      streaming: true,
    };

    if (history && history.length > 0) {
      payload.history = history;
    }

    if (config) {
      payload.overrideConfig = config;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }
    
    // Capture reader in a const for use in the closure
    const streamReader = reader;

    return new ReadableStream({
      start(controller) {
        function pump(): Promise<void> {
          return streamReader.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }

            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data:')) {
                try {
                  const jsonData = line.slice(5);
                  const response = JSON.parse(jsonData);
                  
                  if (response.event === 'token' && response.data) {
                    controller.enqueue(response.data);
                  }
                } catch (e) {
                  // Skip malformed JSON
                }
              }
            }

            return pump();
          });
        }

        return pump();
      },
    });
  }

  async getChatflows(): Promise<any[]> {
    const url = `${this.baseUrl}/api/v1/chatflows`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching chatflows:', error);
      throw error;
    }
  }
}

// Create a singleton instance
export const flowiseClient = new FlowiseClient(
  process.env.NEXT_PUBLIC_FLOWISE_API_HOST || 'http://localhost:3000',
  process.env.FLOWISE_API_KEY
);