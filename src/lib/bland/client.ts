import 'server-only';

export interface BlandCreateAgentParams {
  prompt: string;
  voice: string;
  language?: string;
  temperature?: number;
  first_sentence: string;
  transfer_phone_number?: string | null;
  tools?: Array<{
    name: string;
    description: string;
    url: string;
    method: 'GET' | 'POST';
  }>;
}

export interface BlandSendCallParams {
  phone_number: string;
  agent_id?: string;
  task?: string;
  voice?: string;
  first_sentence?: string;
  wait_for_greeting?: boolean;
}

export class BlandClient {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.bland.ai/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.BLAND_API_KEY || '';
    if (!this.apiKey) {
      console.warn('[BlandClient] Warning: BLAND_API_KEY is not defined in environment.');
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'authorization': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Bland AI API error [${res.status}]: ${errorText}`);
    }

    return res.json() as Promise<T>;
  }

  async createAgent(params: BlandCreateAgentParams): Promise<{ agent_id: string; status: string }> {
    return this.request<{ agent_id: string; status: string }>('/agents', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async updateAgent(agentId: string, params: Partial<BlandCreateAgentParams>): Promise<{ status: string }> {
    return this.request<{ status: string }>(`/agents/${agentId}`, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async sendCall(params: BlandSendCallParams): Promise<{ status: string; call_id: string }> {
    return this.request<{ status: string; call_id: string }>('/calls', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getCallDetails(callId: string): Promise<any> {
    return this.request<any>(`/calls/${callId}`, {
      method: 'GET',
    });
  }
}

