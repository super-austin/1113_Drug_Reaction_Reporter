import type { FC } from "react";

interface ErrorNotificationProps {
  error: string;
}

const ErrorNotification: FC<ErrorNotificationProps> = ({ error }) => {
  return (
    <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg flex items-center">
      <span>{error}</span>
    </div>
  );
};

export default ErrorNotification;
