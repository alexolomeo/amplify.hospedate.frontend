import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CheckIcon from '@/icons/check.svg?react';
import ExclamationTriangleIcon from '@/icons/exclamation-triangle.svg?react';
import InformationCircleIcon from '@/icons/information-circle.svg?react';
import XMarkIcon from '@/icons/x-mark-mini.svg?react';

const CustomToast: React.FC<{
  title?: string;
  message: string;
  type: 'info' | 'success' | 'error';
  closeToast?: () => void;
  image?: string;
}> = ({ title, message, type, closeToast, image }) => {
  const getIconConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckIcon className="h-7 w-7 text-green-600" />,
          bgColor: 'bg-green-50',
        };
      case 'error':
        return {
          icon: <ExclamationTriangleIcon className="h-7 w-7 text-red-600" />,
          bgColor: 'bg-red-50',
        };
      case 'info':
      default:
        return {
          icon: <InformationCircleIcon className="text-accent h-7 w-7" />,
          bgColor: 'bg-yellow-50',
        };
    }
  };

  const iconConfig = getIconConfig();

  return (
    <div className="flex w-full items-center justify-between gap-3">
      {image ? (
        <img
          src={image}
          alt="Notification"
          className="h-14 w-14 rounded-2xl object-cover"
        />
      ) : (
        <div
          className={`flex-shrink-0 ${iconConfig.bgColor} flex h-10 w-10 items-center justify-center rounded-full`}
        >
          {iconConfig.icon}
        </div>
      )}
      <div className="flex flex-col gap-2">
        {title && (
          <div className="text-base-content text-sm font-bold">{title}</div>
        )}
        <div className="text-xs">{message}</div>
      </div>

      <button
        onClick={closeToast}
        className="ml-1 flex h-6 w-6 flex-shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        aria-label="Close notification"
      >
        <XMarkIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={false}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        closeButton={false}
        icon={false}
        toastStyle={{
          borderRadius: '24px',
        }}
      />
    </>
  );
};

export const showToast = {
  success: (message: string, title?: string, image?: string) => {
    toast.success(
      ({ closeToast }) => (
        <CustomToast
          title={title}
          message={message}
          type="success"
          image={image}
          closeToast={closeToast}
        />
      ),
      {
        className: 'custom-toast-success',
      }
    );
  },

  error: (message: string, title?: string, image?: string) => {
    toast.error(
      ({ closeToast }) => (
        <CustomToast
          title={title}
          message={message}
          type="error"
          image={image}
          closeToast={closeToast}
        />
      ),
      {
        className: 'custom-toast-error',
      }
    );
  },

  info: (message: string, title?: string, image?: string) => {
    toast.info(
      ({ closeToast }) => (
        <CustomToast
          title={title}
          message={message}
          type="info"
          image={image}
          closeToast={closeToast}
        />
      ),
      {
        className: 'custom-toast-info',
      }
    );
  },
};
