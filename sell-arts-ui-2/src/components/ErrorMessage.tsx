const ErrorMessage = ({ error, touched }: { touched?: boolean; error?: string }) => {
  return <>{touched && error ? <div className="text-xs text-red-600">{error} </div> : null}</>;
};

export default ErrorMessage;
