import { User, AuthResponse, ApiResponse, ChaincodeRequest, QueryRequest } from '../types/api';

// const API_BASE_URL = 'http://localhost:4000'; // Update this to match your API server
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:4000'
  : 'http://backend:4000';

class ApiService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('authToken');
  }

  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Authentication endpoints
  async register(user: User): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(user),
    });

    const result = await this.handleResponse<AuthResponse>(response);
    if (result.success && result.token) {
      this.token = result.token;
      localStorage.setItem('authToken', this.token);
    }
    return result;
  }

  async createUser(user: User): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(user),
    });

    const result = await this.handleResponse<AuthResponse>(response);
    if (result.success && result.token) {
      this.token = result.token;
      localStorage.setItem('authToken', this.token);
    }
    return result;
  }

  async login(user: User): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(user),
    });

    const result = await this.handleResponse<AuthResponse>(response);
    if (result.success && typeof result.message === 'object' && result.message.token) {
      this.token = result.message.token;
      localStorage.setItem('authToken', this.token);
    }
    return result;
  }

  // Chaincode endpoints
  async invokeChaincode(request: ChaincodeRequest): Promise<ApiResponse> {
    const response = await fetch(
      `${API_BASE_URL}/channels/${request.channelName}/chaincodes/${request.chaincodeName}`,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          fcn: request.fcn,
          args: request.args,
          peers: request.peers,
          transient: request.transient,
        }),
      }
    );

    return this.handleResponse<ApiResponse>(response);
  }

  async queryChaincode(request: QueryRequest): Promise<ApiResponse> {
    const params = new URLSearchParams({
      fcn: request.fcn,
      args: request.args,
    });

    if (request.peer) {
      params.append('peer', request.peer);
    }

    const response = await fetch(
      `${API_BASE_URL}/channels/${request.channelName}/chaincodes/${request.chaincodeName}?${params}`,
      {
        method: 'GET',
        headers: this.getHeaders(),
      }
    );

    return this.handleResponse<ApiResponse>(response);
  }

  async queryQSCC(request: QueryRequest): Promise<ApiResponse> {
    const params = new URLSearchParams({
      fcn: request.fcn,
      args: request.args,
    });

    const response = await fetch(
      `${API_BASE_URL}/qscc/channels/${request.channelName}/chaincodes/${request.chaincodeName}?${params}`,
      {
        method: 'GET',
        headers: this.getHeaders(),
      }
    );

    return this.handleResponse<ApiResponse>(response);
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }
}

export const apiService = new ApiService();