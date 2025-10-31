interface CommonProgressBarProps {
  currentStep: number;
  startIndex: number;
  endIndex: number;
}

export default function CommonProgressBar({
  currentStep,
  startIndex,
  endIndex,
}: CommonProgressBarProps) {
  const totalSteps = endIndex - startIndex + 1;
  const stepsCompleted = Math.min(
    Math.max(currentStep - startIndex, 0),
    totalSteps
  );
  const progressPercent = (stepsCompleted / totalSteps) * 100;

  return (
    <div className="w-full">
      <progress
        className="progress m-0 block h-2 w-full p-0"
        value={progressPercent}
        max={100}
      />
    </div>
  );
}
