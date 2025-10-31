import { type SupportedLanguages } from '@/utils/i18n';
import LegalNameModal from './LegalNameModal';
import PreferredNameModal from './PreferredNameModal';
import EmailModal from './EmailModal';
import PhoneModal from './PhoneModal';

interface LoginPrivacyModalsProps {
  activeModal:
    | 'legalName'
    | 'preferredName'
    | 'email'
    | 'phone'
    | 'identity'
    | null;
  onClose: () => void;
  firstName?: string;
  lastName?: string;
  preferredName?: string;
  email?: string;
  phone?: string;
  lang: SupportedLanguages;
}

const LoginPrivacyModals = ({
  activeModal,
  onClose,
  firstName,
  lastName,
  preferredName,
  email,
  phone,
  lang,
}: LoginPrivacyModalsProps) => {
  const handleLegalNameSave = (newFirstName: string, newLastName: string) => {
    // TODO: Implement save logic for legal name
    console.log('Save legal name:', { newFirstName, newLastName });
    onClose();
  };

  const handlePreferredNameSave = (newPreferredName: string) => {
    // TODO: Implement save logic for preferred name
    console.log('Save preferred name:', { newPreferredName });
    onClose();
  };

  const handleEmailSave = (newEmail: string) => {
    // TODO: Implement save logic for email
    console.log('Save email:', { newEmail });
    onClose();
  };

  const handlePhoneSave = (newPhone: string) => {
    // TODO: Implement save logic for phone
    console.log('Save phone:', { newPhone });
    onClose();
  };

  if (!activeModal) return null;

  return (
    <>
      {/* Legal Name Modal */}
      {activeModal === 'legalName' && (
        <LegalNameModal
          open={true}
          onClose={onClose}
          onCancel={onClose}
          onSave={handleLegalNameSave}
          firstName={firstName}
          lastName={lastName}
          lang={lang}
        />
      )}

      {/* Preferred Name Modal */}
      {activeModal === 'preferredName' && (
        <PreferredNameModal
          open={true}
          onClose={onClose}
          onCancel={onClose}
          onSave={handlePreferredNameSave}
          preferredName={preferredName}
          lang={lang}
        />
      )}

      {/* Email Modal */}
      {activeModal === 'email' && (
        <EmailModal
          open={true}
          onClose={onClose}
          onCancel={onClose}
          onSave={handleEmailSave}
          email={email}
          lang={lang}
        />
      )}

      {/* Phone Modal */}
      {activeModal === 'phone' && (
        <PhoneModal
          open={true}
          onClose={onClose}
          onCancel={onClose}
          onSave={handlePhoneSave}
          phone={phone}
          lang={lang}
        />
      )}
    </>
  );
};

export default LoginPrivacyModals;
