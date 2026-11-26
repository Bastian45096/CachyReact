import type { FieldName } from '../types/form';

export interface FormValues {
  name: string;
  username: string;
  email: string;
  pass: string;
  pass2: string;
  terms: boolean;
}

type Rule = {
  test: (value: any, form: FormValues) => boolean;
  message: string;
};

const required = (message: string): Rule => ({
  test: v => typeof v === 'string' ? v.trim().length > 0 : !!v,
  message,
});

const minLength = (n: number, message: string): Rule => ({
  test: v => typeof v === 'string' && v.trim().length >= n,
  message,
});

const regex = (re: RegExp, message: string): Rule => ({
  test: v => typeof v === 'string' && re.test(v),
  message,
});

const matches = (field: keyof FormValues, message: string): Rule => ({
  test: (v, form) => v === form[field],
  message,
});

const RULES: Partial<Record<FieldName, Rule[]>> = {
  name: [
    required('El nombre es obligatorio'),
    minLength(3, 'Mínimo 3 caracteres'),
  ],
  username: [
    required('El username es obligatorio'),
    regex(/^[a-z0-9_]{3,20}$/, '3–20: minúsculas, números, _'),
  ],
  email: [
    required('El correo es obligatorio'),
    regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Formato inválido'),
  ],
  pass: [
    required('La contraseña es obligatoria'),
    minLength(8, 'Mínimo 8 caracteres'),
  ],
  pass2: [
    required('Confirma tu contraseña'),
    matches('pass', 'Las contraseñas no coinciden'),
  ],
  terms: [
    required('Debes aceptar los términos'),
  ],
};

export function validateField(field: FieldName, form: FormValues): string | undefined {
  const value = form[field];
  const rules = RULES[field] ?? [];
  for (const rule of rules) {
    if (!rule.test(value, form)) return rule.message;
  }
  return undefined;
}

export function isValid(field: FieldName, form: FormValues): boolean {
  return validateField(field, form) === undefined;
}

export const STEP1_FIELDS: FieldName[] = ['name', 'username'];
export const STEP2_FIELDS: FieldName[] = ['email', 'pass', 'pass2', 'terms'];