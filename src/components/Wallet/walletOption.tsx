import React from "react";

interface WalletOptionProps {
  name: string;
  icon?: string;
  onSelect: () => void;
  disabled?: boolean;
}

const WalletOption: React.FC<WalletOptionProps> = ({
  name,
  icon,
  onSelect,
  disabled = false,
}) => {
  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={`flex items-center justify-between w-full border border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-50 transition ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <img
            src={icon}
            alt={`${name} logo`}
            className="w-6 h-6"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}
        <span className="text-gray-800 font-medium">{name}</span>
      </div>
    </button>
  );
};

export default WalletOption;
