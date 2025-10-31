import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/React/Common/LoadingSpinner';
import ErrorIcon from '@/icons/error.svg?react';
import { type SupportedLanguages } from '@/utils/i18n';

interface AppIconProps {
  iconName: string;
  folder: string;
  className?: string;
  tooltip?: string;
  lang?: SupportedLanguages;
  loaderCompact?: boolean;
}

type SvgComponent = React.FC<React.SVGProps<SVGSVGElement>>;

const allIcons = import.meta.glob('/src/icons/*/*.svg', {
  query: 'react',
  eager: false,
});

export default function AppIcon({
  iconName,
  folder,
  className,
  tooltip,
  lang = 'es',
  loaderCompact = false,
}: AppIconProps) {
  const [IconComponent, setIconComponent] = useState<SvgComponent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const expectedPath = `/src/icons/${folder}/${iconName}.svg`;
    const matchKey = Object.keys(allIcons).find((key) => key === expectedPath);

    if (matchKey) {
      allIcons[matchKey]().then((mod) => {
        const Component = (mod as { default: SvgComponent }).default;
        if (isMounted) {
          setIconComponent(() => Component);
          setIsLoading(false);
        }
      });
    } else {
      console.warn(`Icon not found: ${expectedPath}`);
      if (isMounted) {
        setIconComponent(() => null);
        setIsLoading(false);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [iconName, folder]);

  const renderContent = () => {
    if (isLoading) {
      if (loaderCompact) {
        return (
          <div className="loading loading-spinner loading-xs text-primary"></div>
        );
      } else {
        return (
          <LoadingSpinner
            className={className || 'h-4 w-4'}
            lang={lang}
            message=""
          />
        );
      }
    }

    if (!IconComponent) {
      return (
        <span aria-label="Icon not found">
          <ErrorIcon className="text-error h-4 w-4" />
        </span>
      );
    }

    return <IconComponent className={className} />;
  };

  return tooltip ? (
    <div className="tooltip" data-tip={tooltip}>
      {renderContent()}
    </div>
  ) : (
    renderContent()
  );
}
