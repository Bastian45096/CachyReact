import { useState, useCallback } from 'react';
import type { FieldName, Errors, Touched, Step } from '../types/form';
import { validateField, isValid, STEP1_FIELDS, STEP2_FIELDS } from '../utils/validation';
import type { FormValues } from '../utils/validation';

export function useFormValidation() {
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [openError, setOpenError] = useState<FieldName | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const setErrorFor = useCallback((field: FieldName, msg: string | undefined) => {
    setErrors(prev => {
      const next = { ...prev };
      if (msg) next[field] = msg;
      else delete next[field];
      return next;
    });
    setOpenError(prev => (!msg && prev === field) ? null : prev);
  }, []);

  const handleChange = useCallback((field: FieldName, v: FormValues) => {
    if (touched[field] || submitted) setErrorFor(field, validateField(field, v));
  }, [touched, submitted, setErrorFor]);

  const handleBlur = useCallback((field: FieldName, v: FormValues) => {
    setTouched(p => ({ ...p, [field]: true }));
    setErrorFor(field, validateField(field, v));
  }, [setErrorFor]);

  const handleFocus = useCallback((field: FieldName) => {
    setErrors(prev => {
      if (prev[field]) setOpenError(field);
      return prev;
    });
  }, []);

  const validateStep = useCallback((step: Step, v: FormValues): boolean => {
    const fields = step === 1 ? STEP1_FIELDS : STEP2_FIELDS;
    const errs: Errors = {};
    const newTouched: Touched = {};
    for (const f of fields) {
      newTouched[f] = true;
      const msg = validateField(f, v);
      if (msg) errs[f] = msg;
    }
    setTouched(p => ({ ...p, ...newTouched }));
    setErrors(errs);
    setOpenError(fields.find(f => errs[f]) || null);
    return Object.keys(errs).length === 0;
  }, []);

  const showErr = useCallback((field: FieldName): boolean => {
    return !!errors[field] && (touched[field] || submitted);
  }, [errors, touched, submitted]);

  const showOk = useCallback((field: FieldName, v: FormValues): boolean => {
    if (showErr(field)) return false;
    if (!touched[field] && !submitted) return false;
    return isValid(field, v);
  }, [showErr, touched, submitted]);

  const reset = useCallback(() => {
    setErrors({}); setTouched({}); setOpenError(null); setSubmitted(false);
  }, []);

  return {
    errors, touched, openError, submitted,
    setOpenError, setSubmitted,
    handleChange, handleBlur, handleFocus,
    validateStep, setErrorFor, showErr, showOk, reset,
  };
}