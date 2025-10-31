import { useState, useCallback, useEffect } from 'react';
import validator from 'validator';
import type { CompleteRegister, UserRegister } from '@/types/auth';
import type { SupportedLanguages } from '@/utils/i18n.ts';
import { getTranslation } from '@/utils/i18n.ts';
import { parseISO } from 'date-fns';

interface UseRegistrationFormProps {
  email: string;
  lang: SupportedLanguages;
  register: (data: UserRegister) => void;
  completeRegister: (data: CompleteRegister) => void;
  isRegisterForm: boolean;
}

interface FormData {
  firstName: string;
  lastName: string;
  birthDate: string;
  password: string;
  confirmPassword: string;
}

interface FieldTouched {
  firstName: boolean;
  lastName: boolean;
  birthDate: boolean;
  password: boolean;
  confirmPassword: boolean;
}

type ValidationErrors = Record<keyof FieldTouched, string>;

export const useRegistrationForm = ({
  email,
  lang,
  register,
  completeRegister,
  isRegisterForm,
}: UseRegistrationFormProps) => {
  const t = getTranslation(lang);
  const MAX_CHARS = 100;

  // Form state
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    birthDate: '',
    password: '',
    confirmPassword: '',
  });

  const [touched, setTouched] = useState<FieldTouched>({
    firstName: false,
    lastName: false,
    birthDate: false,
    password: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState<ValidationErrors>({
    firstName: '',
    lastName: '',
    birthDate: '',
    password: '',
    confirmPassword: '',
  });

  const [isValid, setIsValid] = useState(false);

  // Validation functions
  const validatePassword = useCallback(
    (value: string, name: string, userEmail: string): string => {
      if (!validator.isLength(value, { min: 8 }))
        return t.register.passwordTooShort;
      if (/^\d+$/.test(value)) return t.register.passwordCannotBeAllNumbers;
      if (/^[a-zA-Z]+$/.test(value))
        return t.register.passwordCannotBeAllLetters;
      if (!/\d|[^a-zA-Z0-9]/.test(value))
        return t.register.passwordNeedsNumberOrSymbol;

      const normalize = (str: string) =>
        str
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '');

      const onlyLetters = (s: string) => s.replace(/[^a-z]/g, '');
      const onlyDigits = (s: string) => s.replace(/\D/g, '');

      const hasWindowOverlap = (
        src: string,
        target: string,
        minLen: number
      ) => {
        if (!src || !target || src.length < minLen) return false;
        for (let i = 0; i <= src.length - minLen; i++) {
          const sub = src.slice(i, i + minLen);
          if (target.includes(sub)) return true;
        }
        return false;
      };

      const pwdN = normalize(value);
      const nameN = normalize(name);
      const userN = normalize(userEmail.split('@')[0]);

      if (nameN.length >= 3 && pwdN.includes(nameN))
        return t.register.passwordContainsPersonalInfo;
      if (userN.length >= 3 && pwdN.includes(userN))
        return t.register.passwordContainsPersonalInfo;

      const pwdLetters = onlyLetters(pwdN);
      const userLetters = onlyLetters(userN);
      const nameLetters = onlyLetters(nameN);

      const pwdDigits = onlyDigits(pwdN);
      const userDigits = onlyDigits(userN);
      const nameDigits = onlyDigits(nameN);

      if (
        hasWindowOverlap(userLetters, pwdLetters, 5) ||
        hasWindowOverlap(nameLetters, pwdLetters, 5)
      ) {
        return t.register.passwordContainsPersonalInfo;
      }
      if (
        hasWindowOverlap(userDigits, pwdDigits, 4) ||
        hasWindowOverlap(nameDigits, pwdDigits, 4)
      ) {
        return t.register.passwordContainsPersonalInfo;
      }
      return '';
    },
    [t.register]
  );

  const validateBirthDate = useCallback(
    (birthDate: string): string => {
      if (!birthDate.trim()) {
        return t.register.requiredField;
      }
      if (!validator.isDate(birthDate)) {
        return t.register.invalidDate;
      }
      const today = new Date();
      const birth = parseISO(birthDate);
      if (birth > today) {
        return t.register.birthDateInFuture;
      }
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
      ) {
        age--;
      }
      if (age < 18) {
        return t.register.mustBeAdult;
      }

      return '';
    },
    [t.register]
  );

  const validateForm = useCallback(() => {
    const newErrors: ValidationErrors = {
      firstName: formData.firstName.trim() ? '' : t.register.requiredField,
      lastName: formData.lastName.trim() ? '' : t.register.requiredField,
      birthDate: validateBirthDate(formData.birthDate),
      password: !isRegisterForm
        ? ''
        : validatePassword(formData.password, formData.firstName, email),
      confirmPassword: !isRegisterForm
        ? ''
        : formData.confirmPassword !== formData.password
          ? t.register.passwordsDoNotMatch
          : '',
    };

    setErrors(newErrors);
    const noErrors = Object.values(newErrors).every((error) => error === '');
    setIsValid(noErrors);
  }, [
    formData,
    email,
    validatePassword,
    validateBirthDate,
    t.register,
    isRegisterForm,
  ]);

  // Form handlers
  const updateField = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const markFieldAsTouched = useCallback((field: keyof FieldTouched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      firstName: '',
      lastName: '',
      birthDate: '',
      password: '',
      confirmPassword: '',
    });
    setTouched({
      firstName: false,
      lastName: false,
      birthDate: false,
      password: false,
      confirmPassword: false,
    });
    setErrors({
      firstName: '',
      lastName: '',
      birthDate: '',
      password: '',
      confirmPassword: '',
    });
  }, []);

  const handleSubmit = useCallback(() => {
    // Mark all fields as touched
    setTouched({
      firstName: true,
      lastName: true,
      birthDate: true,
      password: true,
      confirmPassword: true,
    });

    if (!isValid) return;

    if (isRegisterForm) {
      register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        birthDate: formData.birthDate,
        password: formData.password,
        email: email,
      });
    } else {
      completeRegister({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        birthDate: formData.birthDate,
      });
      resetForm();
    }
  }, [
    formData,
    email,
    isValid,
    register,
    completeRegister,
    resetForm,
    isRegisterForm,
  ]);

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  // Helper functions
  const getFieldError = useCallback(
    (field: keyof FieldTouched): string | null => {
      return touched[field] && errors[field] ? errors[field] : null;
    },
    [touched, errors]
  );

  const shouldShowError = useCallback(
    (field: keyof FieldTouched): boolean => {
      return touched[field] && !!errors[field];
    },
    [touched, errors]
  );

  return {
    formData,
    isValid,
    maxChars: MAX_CHARS,

    updateField,
    markFieldAsTouched,
    handleSubmit,
    resetForm,

    getFieldError,
    shouldShowError,
  };
};
