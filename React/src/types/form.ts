export type FieldName = 'name' | 'username' | 'email' | 'pass' | 'pass2' | 'terms';
export type Errors = Partial<Record<FieldName, string>>;
export type Touched = Partial<Record<FieldName, boolean>>;
export type Step = 1 | 2;
export type ModalPhase = 'loading' | 'eating';