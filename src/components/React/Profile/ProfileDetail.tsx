import { getProfileInfo } from '@/services/users-profile';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import { useEffect, useState } from 'react';
import HostCard from '../Common/HostCard';
import AppButton from '../Common/AppButton';
import About from './About';
import Interests from './Interests';
import Trips from './Trips';
import ShieldCheckIcon from '/src/icons/shield-check.svg?react';
import EditProfileView from './editProfile/EditProfileView';
import ProfileDetailSkeleton from './ProfileDetailSkeleton';
import ShowVerifyIdentityModal from '../VerifyIdentity/ShowVerifyIdentityModal';
import { KycSessionManager } from '@/utils/kycSession';
import type { User } from '@/types/user';
import { navigate } from 'astro/virtual-modules/transitions-router.js';

interface Props {
  lang?: SupportedLanguages;
}

export default function ProfileDetail({ lang = 'es' }: Props) {
  const t = getTranslation(lang);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editing] = useState(false);
  const [showIdvModal, setShowIdvModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const profile = await getProfileInfo();
        if (!profile) {
          setError(t.profile.authenticationRequired);
          return;
        }
        setUser(profile);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setError('An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t.profile.authenticationRequired]);

  if (loading) {
    return <ProfileDetailSkeleton></ProfileDetailSkeleton>;
  }

  if (error || !user) {
    return <div></div>;
  }
  // TODO: Uncomment this section once the functionality is implemented
  // const verifications = [
  //   {
  //     verified: user.emailVerified,
  //     labelConfirmed: t.profile.verificationEmailPending,
  //     label: t.profile.verificationEmailConfirmed,
  //     color: user.emailVerified ? 'text-green-500' : 'text-orange-500',
  //   },
  //   {
  //     verified: user.phoneVerified,
  //     labelConfirmed: t.profile.verificationPhonePending,
  //     label: t.profile.verificationPhoneConfirmed,
  //     color: user.phoneVerified ? 'text-green-500' : 'text-orange-500',
  //   },
  // ];
  const openIdvVerification = async () => {
    try {
      await KycSessionManager.handleVerification(() => {
        // Desktop: Show modal with QR code
        setShowIdvModal(true);
      });
    } catch (error) {
      console.error('Failed to initiate identity verification:', error);
    }
  };
  const closeIdvModal = () => setShowIdvModal(false);

  const handleIdvFinished = async () => {
    // Refresh user data after verification
    try {
      const me = await getProfileInfo();
      setUser(me);
    } catch (e) {
      console.error('Failed to refresh profile after IDV', e);
    }
    closeIdvModal();
  };

  if (editing) {
    return <EditProfileView lang={lang} />;
  }
  const hasAbout = user.info && user.info.about && user.info.about.trim();
  const hasSelectedInterests = user.interests?.some(
    (interest) => interest.selected
  );

  return (
    <>
      <section className="px-4 py-3 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="grid grid-cols-1 space-y-8 gap-x-10 md:grid-cols-5 lg:grid-cols-4">
          <div className="col-span-1 space-y-8 md:col-span-2 lg:col-span-1">
            <HostCard
              profilePicture={user.profilePicture}
              username={user.username}
              isSuperHost={user.isSuperHost}
              isHost={user.isHost}
              totalReviews={null} // UserProfile doesn't have reviews structure
              becameAt={
                user.isHost
                  ? (user.becameHostAt ?? undefined)
                  : user.becameUserAt
              }
              score={user.score != null && user.score >= 0 ? user.score : null}
              id={4}
              enableClick={false}
              isOwnProfile={true}
              trips={user.totalTrips ?? null}
            />

            <div className="space-y-4 py-4">
              <div className="border-base-200 border-b"></div>
              {user.identityVerified ? (
                <div className="flex items-center space-x-2">
                  <ShieldCheckIcon className="text-green-500" />
                  <p className="text-lg font-semibold">
                    {t.profile.identityVerified}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-lg font-semibold">
                    {t.profile.verifyIdentity}
                  </p>
                  <p className="text-neutral text-xs font-normal">
                    {t.profile.verifyIdentityDescription}
                  </p>

                  {/* Open IDV Modal */}
                  <button
                    className="btn btn-outline btn-warning w-full rounded-full"
                    onClick={openIdvVerification}
                  >
                    {t.profile.verifyIdentity}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-1 md:col-span-3 lg:col-span-3">
            {user.info &&
            (user.info.about || hasSelectedInterests || user.reviews) ? (
              <div>
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl leading-loose font-bold">
                    {t.profile.yourProfileTitle}
                  </h1>
                  <AppButton
                    type="submit"
                    label={t.profile.editProfileButton}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/users/edit-profile');
                    }}
                  />
                </div>
                {hasAbout && (
                  <div className="space-y-5 py-7">
                    <p className="text-xl leading-7 font-bold">
                      {t.profile.aboutYou}
                    </p>
                    <p>{user.info?.about}</p>
                  </div>
                )}
                <About
                  user={user}
                  lang={lang}
                  isOwnProfile={true}
                  spokenLanguages={
                    user.info && user.info.languages
                      ? user.info.languages.filter((lang) => lang.selected)
                      : []
                  }
                  showBirthDecade={user.info?.showBirthDecade ?? false}
                />
                <Interests user={user} lang={lang} isOwnProfile={true} />
                <Trips user={user} lang={lang} isOwnProfile={true} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <img
                  src="/images/user_profile.webp"
                  alt="user profile"
                  className="h-56 w-80 object-cover"
                  loading="lazy"
                />
                <h1 className="text-primary pt-4 text-xl font-semibold">
                  {t.profile.completeProfileTitle}
                </h1>
                <p className="max-w-96 pb-6 text-center text-sm font-normal">
                  {t.profile.completeProfileDescription}
                </p>
                <AppButton
                  label={t.profile.createProfileButton}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/users/edit-profile');
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* IDV Modal - Only for desktop users */}
      <ShowVerifyIdentityModal
        isOpen={showIdvModal}
        onClose={closeIdvModal}
        onFinished={handleIdvFinished}
        lang={lang}
      />
    </>
  );
}
