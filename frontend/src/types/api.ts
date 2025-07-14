export interface User {
  username: string;
  orgName: string;
}

export interface AuthResponse {
  success: boolean;
  message: {
    token: string;
  } | string;
  token?: string;
}

export interface ApiResponse<T = any> {
  result: T;
  error: string | null;
  errorData: string | null;
}

export interface ChaincodeRequest {
  channelName: string;
  chaincodeName: string;
  fcn: string;
  args: string[];
  peers?: string[];
  transient?: Record<string, any>;
}

export interface QueryRequest {
  channelName: string;
  chaincodeName: string;
  fcn: string;
  args: string;
  peer?: string;
}