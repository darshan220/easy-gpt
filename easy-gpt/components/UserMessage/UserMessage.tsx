import { MessageProps } from "@/types/type";

const UserMessage: React.FC<MessageProps> = ({ message }) => {
  return (
    <div className="flex justify-end">
      <div className="max-w-xs lg:max-w-md">
        <div className="bg-gray-700 text-white rounded-2xl rounded-br-md px-4 py-2">
          <p className="text-sm">{message.content}</p>
        </div>
        {/* User timestamp details */}
        {/* <div className="flex items-center justify-end mt-1 space-x-1">
          <span className="text-xs text-gray-500">{message.timestamp}</span>
          <svg
            className="w-4 h-4 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div> */}
      </div>
    </div>
  );
};

export default UserMessage;
