import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AppError } from './errors';
import * as Sentry from '@sentry/nextjs';

export function successResponse<T>(
  data: T,
  status = 200,
  meta?: { page?: number; limit?: number; total?: number; totalPages?: number }
) {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(meta && { meta }),
    },
    { status }
  );
}

export function errorResponse(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request payload',
          details: error.flatten().fieldErrors,
        },
      },
      { status: 422 }
    );
  }

  // Catch unexpected errors
  Sentry.captureException(error);
  console.error('[UNHANDLED_EXCEPTION]', error);

  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected internal error occurred',
      },
    },
    { status: 500 }
  );
}

