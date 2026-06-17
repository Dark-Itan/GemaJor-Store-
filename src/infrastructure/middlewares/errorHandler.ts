import { ApiError } from '../responses/ApiError';

export async function errorHandler(handler: () => Promise<Response>): Promise<Response> {
  try {
    return await handler();
  } catch (error) {
    return ApiError.handle(error);
  }
}