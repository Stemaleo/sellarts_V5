interface ErrorMessageProps {
  error?: string;
  touched?: boolean;
}

export default function ErrorMessage({ error, touched }: ErrorMessageProps) {
  if (!error || !touched) return null;
  return <div className="text-sm text-red-500">{error}</div>;
} 