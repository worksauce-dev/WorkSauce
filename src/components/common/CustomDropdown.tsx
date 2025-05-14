import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

interface DropdownOption {
  id: string;
  name: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  selectedOption: string;
  onSelect: (option: string) => void;
  className?: string;
  fullWidth?: boolean;
}

const CustomDropdown = ({
  options,
  selectedOption,
  onSelect,
  className = "",
  fullWidth = true,
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOptionName = options.find(
    opt => opt.id === selectedOption
  )?.name;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (e: React.MouseEvent, optionId: string) => {
    e.stopPropagation();
    onSelect(optionId);
    setIsOpen(false);
  };

  return (
    <div
      className={`relative ${fullWidth ? "w-full" : ""} ${className}`}
      onClick={e => e.stopPropagation()}
    >
      <button
        onClick={handleClick}
        className={`flex items-center justify-between ${
          fullWidth ? "w-full" : "min-w-[200px]"
        } px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200`}
      >
        <span className="truncate">{selectedOptionName}</span>
        <MdKeyboardArrowDown
          className={`transform transition-transform duration-200 flex-shrink-0 ml-2 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div
          className={`absolute top-full right-0 mt-1 ${
            fullWidth ? "w-full" : "min-w-[200px]"
          } bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10`}
          onClick={e => e.stopPropagation()}
        >
          {options.map(option => (
            <button
              key={option.id}
              onClick={e => handleOptionClick(e, option.id)}
              className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 ${
                selectedOption === option.id
                  ? "text-orange-600 font-medium"
                  : "text-gray-700"
              }`}
            >
              <span className="truncate block">{option.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
