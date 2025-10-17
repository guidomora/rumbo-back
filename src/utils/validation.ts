export const parseBoolean = (value: unknown): boolean | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.toLowerCase().trim();
    if (['true', '1', 'yes'].includes(normalized)) {
      return true;
    }
    if (['false', '0', 'no'].includes(normalized)) {
      return false;
    }
  }

  throw new Error('El valor debe ser booleano.');
};

export const parseNumber = (value: unknown, field: string): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  throw new Error(`El campo ${field} debe ser numérico.`);
};

export const parseString = (value: unknown, field: string): string => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }

  throw new Error(`El campo ${field} es requerido.`);
};

export const ensureRequiredFields = <T extends Record<string, unknown>>(
  body: T,
  requiredFields: Array<keyof T>,
): void => {
  const missing = requiredFields.filter((field) => body[field] === undefined || body[field] === null);

  if (missing.length > 0) {
    throw new Error(`Faltan los siguientes campos requeridos: ${missing.join(', ')}`);
  }
};

export const validateDate = (value: string): string => {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;

  if (!datePattern.test(value)) {
    throw new Error('El campo date debe tener el formato YYYY-MM-DD.');
  }

  return value;
};

export const validateTime = (value: string): string => {
  const timePattern = /^\d{2}:\d{2}(:\d{2})?$/;

  if (!timePattern.test(value)) {
    throw new Error('El campo time debe tener el formato HH:mm o HH:mm:ss.');
  }

  return value;
};

export const validateEmail = (email: string): string => {
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!EMAIL_REGEX.test(email)) {
    throw new Error('El formato del email es inválido.');
  }

  return email.toLowerCase();
};

export const validatePhone = (phone: string): string => {
  const PHONE_REGEX = /^[+\d][\d\s-]{6,}$/;

  if (!PHONE_REGEX.test(phone)) {
    throw new Error('El formato del teléfono es inválido.');
  }

  return phone;
};

export const validatePassword = (password: string): string => {
  if (password.length < 8) {
    throw new Error('La contraseña debe tener al menos 8 caracteres.');
  }

  return password;
};
