import React, { useEffect, useMemo, useState } from 'react';
import AvatarDisplay from '../../Common/AvatarDisplay';
import Interests from '../Interests';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import InterestsEditModal from '../components/InterestsEditModal';
import ProfilePhotoUploadModal from '../components/ProfilePhotoUploadModal';
import ProfilePhotoConfirmModal from '../components/ProfilePhotoConfirmModal';
import Chevron from '/src/icons/chevron-left.svg?react';
import PlusIcon from '/src/icons/plus.svg?react';
import About from '../About';
import {
  getProfileInfo,
  updateProfileInfo,
  updateProfilePhoto,
} from '@/services/users-profile';
import type { UpdateUserInfo, UserInfoValues } from '@/services/users-profile';
import AppButton from '../../Common/AppButton';
import type { Language, User } from '@/types/user';
import EditExperience from '../components/EditExperiences';

const NOTIFICATION_DURATION = 5000;
interface EditProfileViewProps {
  lang?: SupportedLanguages;
}

function convertUserInfoToApiFormat(userInfo?: User['info']): UserInfoValues {
  return {
    show_birth_decade: userInfo?.showBirthDecade ?? true,
    work: userInfo?.work ?? '',
    travel_dream: userInfo?.travelDream ?? '',
    pets: userInfo?.pets ?? '',
    school: userInfo?.school ?? '',
    fun_fact: userInfo?.funFact ?? '',
    useless_skill: userInfo?.uselessSkill ?? '',
    wasted_time: userInfo?.wastedTime ?? '',
    favorite_song: userInfo?.favoriteSong ?? '',
    biography_title: userInfo?.biographyTitle ?? '',
    obsession: userInfo?.obsession ?? '',
    about: userInfo?.about ?? '',
    languages:
      userInfo?.languages
        ?.filter((lang) => lang.selected)
        .map((lang) => lang.id) ?? [],
  };
}
export default function EditProfileView({ lang = 'es' }: EditProfileViewProps) {
  const t = getTranslation(lang);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [openInterestsModal, setOpenInterestsModal] = useState(false);

  const [openPhotoUploadModal, setOpenPhotoUploadModal] = useState(false);
  const [openPhotoConfirmModal, setOpenPhotoConfirmModal] = useState(false);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
  const [localProfilePhoto, setLocalProfilePhoto] = useState<string | null>(
    null
  );
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [payload, setPayload] = useState<UserInfoValues>(
    convertUserInfoToApiFormat()
  );
  const [interests, setInterests] = useState<number[]>([]);

  const fetchProfile = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const profile = await getProfileInfo();
      if (!profile) {
        setError(t.profile.authenticationRequired);
        return;
      }
      setUserProfile(profile);
      setPayload(convertUserInfoToApiFormat(profile.info));
      setInterests(
        profile.interests
          ?.filter((interest) => interest.selected)
          .map((interest) => interest.id) || []
      );
    } catch (err) {
      console.error('Failed to fetch user data:', err);
      setError('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (!userProfile) {
      setLocalProfilePhoto(null);
      return;
    }
    setLocalProfilePhoto(userProfile.profilePicture?.original || null);
    setPayload(convertUserInfoToApiFormat(userProfile.info));
  }, [userProfile]);

  // Use local profile photo or original profile picture
  const avatarSrc = useMemo(() => {
    if (localProfilePhoto) {
      return {
        original: localProfilePhoto,
        srcsetWebp: localProfilePhoto,
        srcsetAvif: localProfilePhoto,
      };
    }
    return userProfile?.profilePicture ?? null;
  }, [localProfilePhoto, userProfile?.profilePicture]);

  const handleSaveProfile = async (data: UpdateUserInfo) => {
    if (!userProfile) return;
    try {
      setSaving(true);
      setSaveError(null);
      setSaveSuccess(false);
      await updateProfileInfo(data);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setSaveError(null);
      }, NOTIFICATION_DURATION);
      console.log('Profile saved successfully');
    } catch (error) {
      console.error('Failed to save profile:', error);
      setSaveError('Error saving profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveInfo = async () => {
    await handleSaveProfile({
      info: payload as UserInfoValues,
    });
  };

  const onSaveInterests = async (newInterests: number[]) => {
    setInterests(newInterests);
    setOpenInterestsModal(false);
    await handleSaveProfile({
      interests: newInterests,
    });
  };

  const onSaveExperiences = async (payload: UserInfoValues) => {
    setPayload(payload);
    await handleSaveProfile({
      info: payload as UserInfoValues,
    });
  };

  const handlePhotoUploadClick = () => {
    setOpenPhotoUploadModal(true);
  };

  const handlePhotoSelect = (file: File) => {
    const url = URL.createObjectURL(file);
    setSelectedPhotoFile(file);
    setSelectedPhotoUrl(url);
  };

  const handlePhotoUploadFromModal = () => {
    setOpenPhotoUploadModal(false);
    setOpenPhotoConfirmModal(true);
  };

  const handlePhotoUpload = async () => {
    if (!selectedPhotoFile) return;

    try {
      setUploadingPhoto(true);
      setUploadError(null);
      await updateProfilePhoto(selectedPhotoFile);
      setUserProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          profilePicture: {
            original: selectedPhotoUrl || '',
            srcsetWebp: selectedPhotoUrl || '',
            srcsetAvif: selectedPhotoUrl || '',
          },
        };
      });
      setLocalProfilePhoto(selectedPhotoUrl);
      setOpenPhotoConfirmModal(false);
      setOpenPhotoUploadModal(false);
      console.log('Photo uploaded successfully');
    } catch (error) {
      console.error('Failed to upload photo:', error);
      setUploadError(t.profile.uploadPhotoError);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePhotoConfirm = async () => {
    await handlePhotoUpload();
  };

  const handlePhotoEdit = () => {
    setOpenPhotoConfirmModal(false);
    setOpenPhotoUploadModal(true);
  };

  const handlePhotoModalClose = () => {
    setOpenPhotoUploadModal(false);
  };

  const handlePhotoConfirmModalClose = () => {
    setOpenPhotoConfirmModal(false);
  };

  if (loading) return <section className="px-4 py-6" />;
  if (error || !userProfile) return <section className="px-4 py-6" />;

  return (
    <section className="px-4 py-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
      <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-5 lg:grid-cols-4">
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <div className="sticky top-[88px] z-10 sm:top-20 lg:top-24">
            <a
              href="/users/profile"
              className="text-primary mb-4 inline-flex items-center gap-2 hover:underline sm:mb-6"
            >
              <Chevron className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">
                {t.hostContent.editListing.content.gallery.back}
              </span>
            </a>

            <div className="mx-auto w-full max-w-full text-center sm:max-w-[360px] sm:text-left">
              <div className="flex flex-col items-center">
                <div className="relative inline-block h-20 w-20 sm:h-28 sm:w-28">
                  <AvatarDisplay
                    profilePicture={avatarSrc}
                    username={userProfile.username}
                    size="h-full w-full"
                    sizeText="text-5xl"
                  />
                  {/* Add photo button overlay */}
                  <button
                    type="button"
                    onClick={handlePhotoUploadClick}
                    className="bg-primary absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full text-white shadow-lg transition hover:bg-blue-700 sm:-top-2 sm:-right-2 sm:h-8 sm:w-8"
                    title={t.profile.changeProfilePhoto}
                  >
                    <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
                <p className="mx-auto mt-4 mb-5 max-w-[92%] text-center font-sans text-[15px] font-bold text-[var(--color-neutral)] sm:mt-3 sm:mb-6 sm:max-w-[340px] sm:text-left sm:text-[17px]">
                  {t.profile.addInformation}
                  <span className="text-primary font-bold">
                    {t.profile.willBuild}
                  </span>
                  <span>{t.profile.withOther}</span>
                </p>
                {saveError && (
                  <div className="mt-2 rounded-lg bg-red-50 p-3">
                    <p className="text-sm text-red-600">{saveError}</p>
                  </div>
                )}
                {saveSuccess && (
                  <div className="mt-2 rounded-lg bg-green-50 p-3">
                    <p className="text-sm text-green-600">
                      {t.profile.saveSuccess}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-3 lg:col-span-3">
          <div className="flex flex-col gap-y-7">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl leading-loose font-bold">
                {t.profile.completeProfileTitle}
              </h1>
            </div>

            <div className="space-y-2">
              <label className="block text-base font-semibold">
                {t.profile.completeProfile}
              </label>
              <p> {t.profile.placeholderText}</p>
              <textarea
                value={payload.about}
                onChange={(e) => {
                  setPayload({ ...payload, about: e.target.value });
                }}
                className="min-h-[96px] w-full rounded-2xl border border-[var(--color-neutral-content)] px-4 py-3 text-black outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder={
                  t.hostContent.editListing.content.editDescription
                    .propertySection.placeholder
                }
              />
              <AppButton
                type="button"
                label={saving ? 'Saving...' : t.profile.labelSave}
                disabled={saving}
                className="btn btn-secondary btn-outline rounded-full"
                onClick={() => handleSaveInfo()}
              />
            </div>
            <div>
              <About
                user={{
                  ...userProfile,
                  info: {
                    ...userProfile.info,
                    about: payload.about,
                    languages: userProfile.info?.languages,
                    showBirthDecade: payload.show_birth_decade,
                    work: payload.work,
                    travelDream: payload.travel_dream,
                    pets: payload.pets,
                    school: payload.school,
                    funFact: payload.fun_fact,
                    uselessSkill: payload.useless_skill,
                    wastedTime: payload.wasted_time,
                    favoriteSong: payload.favorite_song,
                    biographyTitle: payload.biography_title,
                    obsession: payload.obsession,
                  },
                }}
                showBirthDecade={payload.show_birth_decade}
                lang={lang}
                isOwnProfile={true}
                isModoEdit={true}
                spokenLanguages={
                  payload.languages
                    .map((languageId) =>
                      userProfile.info?.languages?.find(
                        (l) => l.id === languageId
                      )
                    )
                    .filter(Boolean) as Language[]
                }
              />
              <EditExperience
                lang={lang}
                userProfile={userProfile}
                onSaveExperiences={onSaveExperiences}
                payload={payload}
              ></EditExperience>
            </div>

            <div>
              <div className="space-y-4 py-7">
                <Interests
                  user={{
                    ...userProfile,
                    interests: userProfile.interests?.map((interest) => ({
                      ...interest,
                      selected: interests.includes(interest.id),
                    })),
                  }}
                  lang={lang}
                  isOwnProfile={true}
                  isModoEdit={true}
                />
              </div>
              <AppButton
                type="button"
                label={t.profile.titleInterest}
                className="btn btn-secondary btn-outline rounded-full"
                onClick={() => setOpenInterestsModal(true)}
              />
            </div>
          </div>
        </div>
      </div>

      <InterestsEditModal
        isOpen={openInterestsModal}
        selected={interests}
        onClose={() => setOpenInterestsModal(false)}
        onSave={onSaveInterests}
        catalog={userProfile.interests}
        lang={lang}
        saving={false}
        error={null}
      />
      <ProfilePhotoUploadModal
        isOpen={openPhotoUploadModal}
        onClose={handlePhotoModalClose}
        onPhotoSelect={handlePhotoSelect}
        onSkip={handlePhotoModalClose}
        onUpload={handlePhotoUploadFromModal}
        currentPhoto={localProfilePhoto}
        selectedPhoto={selectedPhotoUrl}
        hasSelectedPhoto={!!selectedPhotoFile}
        username={userProfile.username}
        loading={uploadingPhoto}
        lang={lang}
      />

      <ProfilePhotoConfirmModal
        isOpen={openPhotoConfirmModal}
        onClose={handlePhotoConfirmModalClose}
        onConfirm={handlePhotoConfirm}
        onEdit={handlePhotoEdit}
        photoUrl={selectedPhotoUrl || ''}
        username={userProfile.username}
        lang={lang}
        uploading={uploadingPhoto}
        uploadError={uploadError}
        onClearError={() => setUploadError(null)}
      />
    </section>
  );
}
