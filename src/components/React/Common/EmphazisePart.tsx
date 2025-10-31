const EmphasizePart = ({
  text,
  emphasize,
  className = '',
}: {
  text: string;
  emphasize: string;
  className?: string;
}) => {
  const i = text.indexOf(emphasize);
  if (i === -1) return <>{text}</>;
  const before = text.slice(0, i);
  const after = text.slice(i + emphasize.length);
  return (
    <div className={className}>
      {before}
      <strong>{emphasize}</strong>
      {after}
    </div>
  );
};
export default EmphasizePart;
