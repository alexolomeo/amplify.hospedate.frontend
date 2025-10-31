import UserCircleOutlineIcon from '/src/icons/user-circle-outline.svg?react';
import { ResponsiveImage } from '../Common/ResponsiveImage';
import type { Photo } from '@/types/listing/space';
import { clsx } from 'yet-another-react-lightbox';
interface Props {
  profilePicture: Photo | null | undefined;
  username: string | null | undefined;
  size: string;
  sizeText: string;
}

export default function AvatarDisplay({
  profilePicture,
  username,
  size,
  sizeText,
}: Props) {
  if (profilePicture) {
    return (
      <div className={clsx('overflow-hidden rounded-full', size)}>
        <ResponsiveImage
          photo={profilePicture}
          alt="User profile picture"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  if (username && username.length > 0) {
    const initial = username.charAt(0).toUpperCase();
    return (
      <div
        className={clsx(
          'bg-primary text-primary-content flex items-center justify-center rounded-full font-bold',
          size,
          sizeText
        )}
      >
        {initial}
      </div>
    );
  }

  return (
    <UserCircleOutlineIcon
      className={clsx(
        'text-[var(--color-primary)] transition-colors duration-200 group-hover:text-[var(--color-base-100)]',
        size
      )}
    />
  );
}
