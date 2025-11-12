import { AxiosInstance } from 'axios'
import { defaultAxiosInstance } from './config/axios-config'
import {
  executeLoginRequest,
  LoginRequestParams,
} from './requests/LoginRequest'
import {
  executeRegisterRequest,
  RegisterRequestParams,
} from './requests/RegisterRequest'
import { executeLogoutRequest } from './requests/LogoutRequest'
import { executeGetMeRequest } from './requests/GetMeRequest'
import {
  LoginResponse,
  RegisterResponse,
  MeResponse,
} from './responses/AuthResponses'

/**
 * AuthWebClient
 * 
 * Web client for authentication-related API calls.
 * 
 * Rules:
 * - Only references request functions (does not define axios calls)
 * - All axios calls are in separate Request files
 * - WebClientError exceptions propagate to UI
 * 
 * @example
 * const authWebClient = new AuthWebClient()
 * 
 * try {
 *   const response = await authWebClient.login({ email, password })
 *   console.log('Logged in:', response.user)
 * } catch (error) {
 *   if (error instanceof WebClientError) {
 *     showError(error.getUserMessage())
 *   }
 * }
 */
export class AuthWebClient {
  private axiosInstance: AxiosInstance

  constructor(axiosInstance: AxiosInstance = defaultAxiosInstance) {
    this.axiosInstance = axiosInstance
  }

  /**
   * Login user
   * 
   * @param params - Email and password
   * @returns Promise resolving to LoginResponse
   * @throws WebClientError on failure
   */
  public async login(params: LoginRequestParams): Promise<LoginResponse> {
    return executeLoginRequest(this.axiosInstance, params)
  }

  /**
   * Register new user
   * 
   * @param params - Email, password, and name
   * @returns Promise resolving to RegisterResponse
   * @throws WebClientError on failure
   */
  public async register(params: RegisterRequestParams): Promise<RegisterResponse> {
    return executeRegisterRequest(this.axiosInstance, params)
  }

  /**
   * Logout user
   * 
   * @returns Promise resolving to void
   * @throws WebClientError on failure
   */
  public async logout(): Promise<void> {
    return executeLogoutRequest(this.axiosInstance)
  }

  /**
   * Get current user profile
   * 
   * @returns Promise resolving to MeResponse
   * @throws WebClientError on failure
   */
  public async getMe(): Promise<MeResponse> {
    return executeGetMeRequest(this.axiosInstance)
  }
}

/**
 * Default AuthWebClient instance
 * Use this throughout the application
 */
export const authWebClient = new AuthWebClient()
