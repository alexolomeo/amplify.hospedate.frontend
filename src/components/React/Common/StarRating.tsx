import StarIcon from '/src/icons/star.svg?react';
interface Props {
  rating: number;
  maxStars?: number;
  size?: string;
}

const StarRating: React.FC<Props> = ({
  rating,
  maxStars = 5,
  size = 'w-5 h-5',
}) => {
  const roundedRating = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxStars }, (_, idx) => (
        <StarIcon
          key={idx}
          name="star"
          className={`${size} shrink-0 ${idx < roundedRating ? 'text-accent' : 'text-gray-200'}`}
        />
      ))}
    </div>
  );
};

export default StarRating;
