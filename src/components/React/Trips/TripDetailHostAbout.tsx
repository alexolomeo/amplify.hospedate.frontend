import React, { useState } from 'react';
import { translate, type SupportedLanguages } from '@/utils/i18n';
import type { TripDetail } from '@/types/tripDetail';
import StarLineIcon from '/src/icons/star-line.svg?react';
import UploadIcon from '/src/icons/upload-line.svg?react';
import HomeIcon from '/src/icons/home-line.svg?react';
import { navigate } from 'astro/virtual-modules/transitions-router.js';
import { createTripConversation } from '@/services/chat';
import ModalMessage from '../Common/ModalMessage';
import ShieldCheckIcon from '/src/icons/shield-check.svg?react';
interface TripDetailHostAboutProps {
  tripDetail: TripDetail;
  t: ReturnType<typeof translate>;
  lang: SupportedLanguages;
  isHost?: boolean;
}

const TripDetailHostAbout: React.FC<TripDetailHostAboutProps> = ({
  tripDetail,
  t,
  isHost = false,
  lang,
}) => {
  const [showModalMessage, setShowModalMessage] = useState(false);
  const [sending, setSending] = useState(false);
  const info = isHost ? tripDetail.guest : tripDetail.host;
  const becameUserAt = isHost
    ? tripDetail.host.becameHostAt
    : tripDetail.guest.becameUserAt;
  const profileText = isHost
    ? t.tripDetail.actions.viewGuestProfile
    : t.tripDetail.actions.viewHostProfile;

  const handleViewHostProfile = () => {
    navigate('/users/' + info.id);
  };

  const handleCreateConversation = async (message: string) => {
    if (!message || message.trim() === '') return;
    setSending(true);
    try {
      const chat = await createTripConversation(tripDetail.id, {
        content: message,
      });
      const chatId = chat?.id;

      if (!chatId) {
        console.error('No valid chat ID');
        return;
      }

      navigate(`/users/messages/${chatId}`);
    } catch (error) {
      setSending(false);
      console.error('Error creating chat message:', error);
    }
  };

  const handleViewConversation = async () => {
    const chatId = tripDetail.booking.chatId;
    if (!chatId) {
      setShowModalMessage(true);
    } else {
      navigate(`/users/messages/${chatId}`);
    }
  };

  return (
    <section className="flex flex-col gap-4 px-4 sm:gap-6 sm:px-0">
      {/* About Host Section */}
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-base-content text-lg font-bold sm:text-xl">
            {t.tripDetail.host.about.replace('{hostName}', info.username)}
          </h3>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
            <button
              onClick={handleViewHostProfile}
              className="border-secondary text-secondary flex h-10 cursor-pointer items-center justify-center rounded-full border px-4 py-0 shadow-sm sm:h-12"
            >
              <span className="text-xs font-semibold sm:text-sm">
                {profileText}
              </span>
            </button>
            <button
              onClick={handleViewConversation}
              className="flex h-10 cursor-pointer items-center justify-center rounded-full px-4 py-0 sm:h-12"
            >
              <span className="text-secondary text-xs font-semibold sm:text-sm">
                {t.tripDetail.actions.viewConversation}
              </span>
            </button>
          </div>
        </div>

        {/* Host Details */}
        <div className="flex flex-col gap-2">
          {/* Identity Verification */}
          {info.identityVerified !== undefined && (
            <div className="flex items-center gap-2">
              <ShieldCheckIcon
                className={`h-4 w-4 ${info.identityVerified ? 'text-secondary' : 'text-warning'}`}
              />
              <span className="text-base-content text-xs sm:text-sm">
                {translate(
                  t,
                  info.identityVerified
                    ? 'tripDetail.host.verified'
                    : 'tripDetail.host.noVerified'
                )}
              </span>
            </div>
          )}

          {/* Reviews */}
          {info.totalReviews !== undefined && (
            <div className="flex items-center gap-2">
              <StarLineIcon className="text-secondary h-4 w-4" />
              <span className="text-base-content text-xs sm:text-sm">
                {info.totalReviews === 0
                  ? translate(t, 'tripDetail.host.noReviews')
                  : tripDetail.score
                    ? translate(t, 'tripDetail.host.ratingAndReviews', {
                        rating: tripDetail.score.toString(),
                        count: info.totalReviews.toString(),
                      })
                    : translate(t, 'tripDetail.host.reviews', {
                        count: info.totalReviews.toString(),
                      })}
              </span>
            </div>
          )}

          {/* Joined */}
          {becameUserAt && (
            <div className="flex items-center gap-2">
              <UploadIcon className="text-secondary h-4 w-4" />
              <span className="text-base-content text-xs sm:text-sm">
                {t.tripDetail.host.joinedIn.replace(
                  '{year}',
                  new Date(becameUserAt).getFullYear().toString()
                )}
              </span>
            </div>
          )}

          {/* Live */}
          {info.city && info.country && (
            <div className="flex items-center gap-2">
              <HomeIcon className="text-secondary h-4 w-4" />
              <span className="text-base-content text-xs sm:text-sm">
                {translate(t, 'tripDetail.host.livesInCityCountry', {
                  city: info.city,
                  country: info.country,
                })}
              </span>
            </div>
          )}
        </div>
      </div>

      <ModalMessage
        open={showModalMessage}
        onClose={() => setShowModalMessage(false)}
        avatarPhoto={info.profilePicture}
        onSend={handleCreateConversation}
        sending={sending}
        lang={lang}
        userName={info.username}
        userDescription={translate(
          t,
          isHost
            ? 'commonComponents.messageModal.descriptionGuest'
            : 'commonComponents.messageModal.descriptionHost',
          {
            name: info.username,
          }
        )}
        isHost={isHost}
      />
    </section>
  );
};

export default TripDetailHostAbout;
