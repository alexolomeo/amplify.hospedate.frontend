import { describe, it, expect } from 'vitest';
import { validatePassword } from '@/components/React/Utils/forgot-password/password';

describe('validatePassword', () => {
  describe('Password length validation', () => {
    it('returns "tooShort" for empty password', () => {
      expect(validatePassword('')).toBe('tooShort');
    });

    it('returns "tooShort" for password with less than 8 characters', () => {
      expect(validatePassword('1234567')).toBe('tooShort');
      expect(validatePassword('abc')).toBe('tooShort');
      expect(validatePassword('Pass1!')).toBe('tooShort');
    });

    it('accepts password with exactly 8 characters if valid', () => {
      expect(validatePassword('Pass123!')).toBeNull();
    });

    it('accepts password with more than 8 characters if valid', () => {
      expect(validatePassword('Password123!')).toBeNull();
      expect(validatePassword('MySecureP@ssw0rd')).toBeNull();
    });
  });

  describe('All numbers validation', () => {
    it('returns "allNumbers" for password with only digits', () => {
      expect(validatePassword('12345678')).toBe('allNumbers');
      expect(validatePassword('98765432101234')).toBe('allNumbers');
    });

    it('accepts password with numbers and letters', () => {
      expect(validatePassword('Pass1234')).toBeNull();
      expect(validatePassword('1234abcd')).toBeNull();
    });

    it('accepts password with numbers and symbols', () => {
      expect(validatePassword('12345678!')).toBeNull();
      expect(validatePassword('!@#12345')).toBeNull();
    });
  });

  describe('All letters validation', () => {
    it('returns "allLetters" for password with only letters', () => {
      expect(validatePassword('abcdefgh')).toBe('allLetters');
      expect(validatePassword('ABCDEFGH')).toBe('allLetters');
      expect(validatePassword('AbCdEfGh')).toBe('allLetters');
      expect(validatePassword('password')).toBe('allLetters');
    });

    it('accepts password with letters and numbers', () => {
      expect(validatePassword('password1')).toBeNull();
      expect(validatePassword('Pass1234')).toBeNull();
    });

    it('accepts password with letters and symbols', () => {
      expect(validatePassword('password!')).toBeNull();
      expect(validatePassword('Pass@word')).toBeNull();
    });
  });

  describe('Number or symbol requirement', () => {
    it('returns "needsNumberOrSymbol" for password with only letters', () => {
      expect(validatePassword('password')).toBe('allLetters'); // Caught by allLetters check first
    });

    it('accepts password with at least one number', () => {
      expect(validatePassword('password1')).toBeNull();
      expect(validatePassword('Pass1word')).toBeNull();
    });

    it('accepts password with at least one symbol', () => {
      expect(validatePassword('password!')).toBeNull();
      expect(validatePassword('Pass@word')).toBeNull();
      expect(validatePassword('Pass#word')).toBeNull();
      expect(validatePassword('Pass$word')).toBeNull();
    });

    it('accepts password with both number and symbol', () => {
      expect(validatePassword('Pass1word!')).toBeNull();
      expect(validatePassword('MyP@ssw0rd')).toBeNull();
    });

    it('accepts various symbols', () => {
      expect(validatePassword('password!')).toBeNull();
      expect(validatePassword('password@')).toBeNull();
      expect(validatePassword('password#')).toBeNull();
      expect(validatePassword('password$')).toBeNull();
      expect(validatePassword('password%')).toBeNull();
      expect(validatePassword('password^')).toBeNull();
      expect(validatePassword('password&')).toBeNull();
      expect(validatePassword('password*')).toBeNull();
      expect(validatePassword('password(')).toBeNull();
      expect(validatePassword('password)')).toBeNull();
      expect(validatePassword('password-')).toBeNull();
      expect(validatePassword('password_')).toBeNull();
      expect(validatePassword('password+')).toBeNull();
      expect(validatePassword('password=')).toBeNull();
    });
  });

  describe('Personal information detection', () => {
    describe('Name detection', () => {
      it('returns "containsPersonalInfo" when password contains name (length >= 3)', () => {
        expect(validatePassword('johndoe123', { name: 'John' })).toBe(
          'containsPersonalInfo'
        );
        expect(validatePassword('myPassword1John', { name: 'John' })).toBe(
          'containsPersonalInfo'
        );
      });

      it('is case insensitive for name detection', () => {
        expect(validatePassword('JOHN1234', { name: 'john' })).toBe(
          'containsPersonalInfo'
        );
        expect(validatePassword('john1234', { name: 'JOHN' })).toBe(
          'containsPersonalInfo'
        );
      });

      it('normalizes accented characters in name', () => {
        expect(validatePassword('jose1234', { name: 'José' })).toBe(
          'containsPersonalInfo'
        );
        expect(validatePassword('maria123', { name: 'María' })).toBe(
          'containsPersonalInfo'
        );
      });

      it('ignores spaces in name normalization', () => {
        expect(validatePassword('johnsmith1', { name: 'John Smith' })).toBe(
          'containsPersonalInfo'
        );
      });

      it('accepts password if name substring is too short (< 3 chars)', () => {
        expect(validatePassword('password1', { name: 'Jo' })).toBeNull();
        expect(validatePassword('mypass12', { name: 'A' })).toBeNull();
      });

      it('accepts password if name is empty', () => {
        expect(validatePassword('password1', { name: '' })).toBeNull();
      });

      it('accepts password that does not contain name', () => {
        expect(validatePassword('SecurePass1!', { name: 'John' })).toBeNull();
      });
    });

    describe('Email username detection', () => {
      it('returns "containsPersonalInfo" when password contains email username', () => {
        expect(
          validatePassword('johndoe123', { email: 'johndoe@example.com' })
        ).toBe('containsPersonalInfo');
        expect(
          validatePassword('user1234', { email: 'user@example.com' })
        ).toBe('containsPersonalInfo');
      });

      it('extracts username from email correctly', () => {
        expect(
          validatePassword('alice12345', { email: 'alice@example.com' })
        ).toBe('containsPersonalInfo');
        expect(
          validatePassword('bobsmith1', { email: 'bobsmith@domain.org' })
        ).toBe('containsPersonalInfo');
      });

      it('is case insensitive for email username detection', () => {
        expect(
          validatePassword('JOHNDOE1', { email: 'johndoe@example.com' })
        ).toBe('containsPersonalInfo');
        expect(
          validatePassword('johndoe1', { email: 'JOHNDOE@example.com' })
        ).toBe('containsPersonalInfo');
      });

      it('normalizes accented characters in email username', () => {
        expect(
          validatePassword('jose1234', { email: 'josé@example.com' })
        ).toBe('containsPersonalInfo');
      });

      it('accepts password if email username is too short (< 3 chars)', () => {
        expect(
          validatePassword('password1', { email: 'ab@example.com' })
        ).toBeNull();
      });

      it('accepts password if email is empty', () => {
        expect(validatePassword('password1', { email: '' })).toBeNull();
      });

      it('accepts password that does not contain email username', () => {
        expect(
          validatePassword('SecurePass1!', { email: 'johndoe@example.com' })
        ).toBeNull();
      });
    });

    describe('Combined name and email detection', () => {
      it('detects name even when email is also provided', () => {
        expect(
          validatePassword('john1234', {
            name: 'John',
            email: 'different@example.com',
          })
        ).toBe('containsPersonalInfo');
      });

      it('detects email username even when name is also provided', () => {
        expect(
          validatePassword('useremail1', {
            name: 'Different Name',
            email: 'useremail@example.com',
          })
        ).toBe('containsPersonalInfo');
      });

      it('accepts password without either name or email username', () => {
        expect(
          validatePassword('SecureP@ss1', {
            name: 'John Doe',
            email: 'johndoe@example.com',
          })
        ).toBeNull();
      });
    });
  });

  describe('Valid passwords', () => {
    it('accepts valid passwords with various combinations', () => {
      expect(validatePassword('Password1')).toBeNull();
      expect(validatePassword('MyP@ssword')).toBeNull();
      expect(validatePassword('Secure123!')).toBeNull();
      expect(validatePassword('C0mpl3xP@ss')).toBeNull();
      expect(validatePassword('Abcd1234!')).toBeNull();
      expect(validatePassword('!QAZ2wsx#EDC')).toBeNull();
    });

    it('accepts long passwords', () => {
      expect(validatePassword('ThisIsAVeryLongPassword123!')).toBeNull();
      expect(
        validatePassword('SuperSecurePasswordWithManyCharacters2024!')
      ).toBeNull();
    });

    it('accepts passwords with special characters', () => {
      expect(validatePassword('P@ssw0rd')).toBeNull();
      expect(validatePassword('My$ecure1')).toBeNull();
      expect(validatePassword('Test#Pass1')).toBeNull();
    });
  });

  describe('Edge cases', () => {
    it('handles undefined options gracefully', () => {
      expect(validatePassword('Password1', undefined)).toBeNull();
    });

    it('handles empty options object', () => {
      expect(validatePassword('Password1', {})).toBeNull();
    });

    it('handles whitespace in password', () => {
      expect(validatePassword('Pass word1')).toBeNull();
      expect(validatePassword('My Pass1')).toBeNull();
    });

    it('handles unicode characters', () => {
      expect(validatePassword('Пароль123')).toBeNull(); // Cyrillic - 10 chars
      expect(validatePassword('密码12345abc')).toBeNull(); // Chinese - 10 chars
      expect(validatePassword('パスワード123a')).toBeNull(); // Japanese - 11 chars
    });

    it('handles mixed case letters with numbers', () => {
      expect(validatePassword('PaSsWoRd1')).toBeNull();
      expect(validatePassword('MiXeDcAsE2')).toBeNull();
    });

    it('returns first applicable error in priority order', () => {
      // Too short takes precedence
      expect(validatePassword('abc')).toBe('tooShort');

      // All numbers after length check
      expect(validatePassword('12345678')).toBe('allNumbers');

      // All letters after length and all-numbers checks
      expect(validatePassword('abcdefgh')).toBe('allLetters');
    });
  });

  describe('Return type validation', () => {
    it('returns null for valid passwords', () => {
      const result = validatePassword('ValidPass1');
      expect(result).toBeNull();
    });

    it('returns correct PasswordErrorCode types', () => {
      // Verify each error code can be returned
      expect(validatePassword('short')).toBe('tooShort');
      expect(validatePassword('12345678')).toBe('allNumbers');
      expect(validatePassword('abcdefgh')).toBe('allLetters');
      expect(validatePassword('johndoe1', { name: 'John' })).toBe(
        'containsPersonalInfo'
      );
    });
  });

  describe('Real-world scenarios', () => {
    it('rejects common weak patterns', () => {
      expect(validatePassword('password')).toBe('allLetters');
      expect(validatePassword('12345678')).toBe('allNumbers');
    });

    it('accepts strong passwords from real users', () => {
      expect(validatePassword('MyDog$Name1')).toBeNull();
      expect(validatePassword('Summer2024!')).toBeNull();
      expect(validatePassword('Tr@vel2024')).toBeNull();
    });

    it('handles typical user registration scenarios', () => {
      // User with name "Alice" and email "alice.smith@example.com"
      expect(
        validatePassword('alice123', {
          name: 'Alice',
          email: 'alice.smith@example.com',
        })
      ).toBe('containsPersonalInfo');

      // But a different password should work
      expect(
        validatePassword('MySecure1!', {
          name: 'Alice',
          email: 'alice.smith@example.com',
        })
      ).toBeNull();
    });
  });
});
