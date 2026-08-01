import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      return throwError(() => new ApiError(friendlyMessage(error), error.status));
    }),
  );
};

function friendlyMessage(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'No se pudo conectar con el servidor. Revisá tu conexión.';
  }

  if (error.status === 404) {
    return 'El recurso solicitado no existe.';
  }

  if (error.status >= 500) {
    return 'El servidor no está respondiendo. Intentá de nuevo más tarde.';
  }

  return 'Ocurrió un error inesperado al conectar con la API.';
}
