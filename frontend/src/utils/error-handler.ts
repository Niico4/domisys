import { addToast } from '@heroui/react';
import axios from 'axios';

interface ErrorConfig {
  title: string;
  description: string;
}

interface ValidationDetail {
  message: string;
}

const ERROR_MESSAGES: Record<number, ErrorConfig> = {
  400: {
    title: 'Datos inválidos',
    description: 'Verifica los datos ingresados',
  },
  401: {
    title: 'Credenciales inválidas',
    description: 'Usuario o contraseña incorrectos',
  },
  403: {
    title: 'Acceso denegado',
    description: 'No tienes permisos para esta acción',
  },
  404: {
    title: 'No encontrado',
    description: 'El recurso solicitado no existe',
  },
  409: {
    title: 'Conflicto',
    description: 'Ya existe un registro con estos datos',
  },
  500: {
    title: 'Error del servidor',
    description: 'Intenta de nuevo más tarde',
  },
  503: {
    title: 'Servicio no disponible',
    description: 'El servidor no está disponible en este momento',
  },
};

export const handleApiError = (error: unknown): void => {
  console.error(error); //TODO: eliminar en producción
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const status = error.response.status;

      const backendError = error.response.data;
      const backendMessage =
        backendError?.message ||
        backendError?.error ||
        'Ocurrió un error inesperado';

      let validationDetails = '';
      if (backendError?.details && Array.isArray(backendError.details)) {
        validationDetails = backendError.details
          .map((detail: ValidationDetail) => `• ${detail.message}`)
          .join('\n');
      }

      const errorConfig = ERROR_MESSAGES[status] || {
        title: 'Error',
        description: backendMessage,
      };

      addToast({
        color: 'danger',
        title: errorConfig.title,
        description:
          validationDetails.length > 0
            ? validationDetails
            : backendMessage || errorConfig.description,
      });

      return;
    } else if (error.request) {
      addToast({
        color: 'danger',
        title: 'Error de conexión',
        description: 'No se pudo conectar con el servidor',
      });
    } else {
      addToast({
        color: 'danger',
        title: 'Error',
        description: error.message || 'Ocurrió un error inesperado',
      });
    }
  } else if (error instanceof Error) {
    addToast({
      color: 'danger',
      title: 'Error',
      description: error.message,
    });
  } else {
    addToast({
      color: 'danger',
      title: 'Error',
      description: 'Ocurrió un error inesperado',
    });
  }
};
