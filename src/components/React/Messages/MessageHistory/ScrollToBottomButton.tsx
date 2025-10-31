import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ChevronDownIcon from 'src/icons/chevron-down.svg?react';

interface Props {
  visible: boolean;
  count: number;
  title: string;
  onClick: () => void;
}

const ScrollToBottomButton: React.FC<Props> = ({
  visible,
  count,
  title,
  onClick,
}) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="scroll-to-bottom"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="pointer-events-none absolute right-4 bottom-4 z-20 md:right-6"
        >
          <button
            type="button"
            onClick={onClick}
            className="bg-primary hover:bg-secondary pointer-events-auto relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-white shadow-lg transition"
            title={title}
            aria-label={title}
          >
            <ChevronDownIcon className="h-6 w-6" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[0.7rem] leading-5 text-white">
                {count}
              </span>
            )}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollToBottomButton;
