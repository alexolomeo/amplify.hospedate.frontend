import ProgressBar from '@/components/React/Common/ProgressBar';

interface WizardProgressBarProps {
  currentStep: number;
}

export default function WizardProgressBar({
  currentStep,
}: WizardProgressBarProps) {
  const SECTION_RANGES = [
    { start: 1, end: 5 },
    { start: 6, end: 11 },
    { start: 12, end: 13 },
  ];

  if (currentStep === 0) {
    return (
      <div className="w-full">
        <ProgressBar currentStep={0} startIndex={0} endIndex={0} />
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-3 gap-x-4">
      {SECTION_RANGES.map((range, index) => (
        <ProgressBar
          key={index}
          currentStep={currentStep}
          startIndex={range.start}
          endIndex={range.end}
        />
      ))}
    </div>
  );
}
