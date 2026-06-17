import { NextResponse } from 'next/server';
import { DomainError } from '../../../shared/errors/DomainError';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { ConflictError } from '../../../shared/errors/ConflictError';
import { ValidationError } from '../../../shared/errors/ValidationError';
import { UnauthorizedError } from '../../../shared/errors/UnauthorizedError';
import { ForbiddenError } from '../../../shared/errors/ForbiddenError';

export class ApiError {
  static handle(error: unknown) {
    if (error instanceof NotFoundError) {
      return NextResponse.json({
        code: error.code,
        message: error.message,
        details: error.details
      }, { status: 404 });
    }

    if (error instanceof ConflictError) {
      return NextResponse.json({
        code: error.code,
        message: error.message,
        details: error.details
      }, { status: 409 });
    }

    if (error instanceof ValidationError) {
      return NextResponse.json({
        code: error.code,
        message: error.message,
        details: error.details
      }, { status: 422 });
    }

    if (error instanceof UnauthorizedError) {
      return NextResponse.json({
        code: error.code,
        message: error.message,
        details: error.details
      }, { status: 401 });
    }

    if (error instanceof ForbiddenError) {
      return NextResponse.json({
        code: error.code,
        message: error.message,
        details: error.details
      }, { status: 403 });
    }

    if (error instanceof DomainError) {
      return NextResponse.json({
        code: error.code,
        message: error.message,
        details: error.details
      }, { status: 400 });
    }

    // Error desconocido (500)
    console.error('Internal Server Error:', error);
    return NextResponse.json({
      code: 'INTERNAL_ERROR',
      message: 'Ocurrio un error inesperado. Estamos trabajando para solucionarlo. Intentalo de nuevo mas tarde.',
      details: {}
    }, { status: 500 });
  }
}