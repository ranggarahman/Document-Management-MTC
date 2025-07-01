import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

/**
 * A reusable and modern dropdown component.
 * @param {{
 * value: string;
 * onChange: (value: string) => void;
 * placeholder?: string;
 * options: string[];
 * label: string;
 * }} props
 */
type CustomDropdownProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options: string[];
  label: string;
};

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  onChange,
  placeholder = "Select an option",
  options,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Effect to handle clicks outside of the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as HTMLDivElement).contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  interface OptionClickHandler {
    (optionValue: string): void;
  }

  const handleOptionClick: OptionClickHandler = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedLabel = options.find((opt) => opt === value) || placeholder;

  return (
    <div className="w-full">
      <label
        htmlFor={`dropdown-${label}`}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative mt-1" ref={dropdownRef}>
        <button
          id={`dropdown-${label}`}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span
            className={`block truncate ${
              value ? "text-gray-900" : "text-gray-400"
            }`}
          >
            {selectedLabel}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDown
              className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </span>
        </button>

        {isOpen && (
          // The list is now a 3-column grid on wider screens.
          // It has a wider max-width to accommodate the columns.
          <ul
            className="absolute z-10 mt-1 w-auto min-w-full md:w-[24rem] max-h-72 overflow-auto rounded-md bg-white p-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm grid grid-cols-1 md:grid-cols-3 gap-1"
            role="listbox"
          >
            {/* This is the option for an empty string value, it spans all columns */}
            <li
              onClick={() => handleOptionClick("")}
              className="md:col-span-3 cursor-pointer select-none relative py-2 px-3 text-gray-500 hover:bg-indigo-600 hover:text-white rounded-md"
            >
              {placeholder}
            </li>
            {options.map((option) => (
              <li
                key={option}
                onClick={() => handleOptionClick(option)}
                className="cursor-pointer select-none relative py-2 px-3 text-center text-gray-900 hover:bg-indigo-600 hover:text-white rounded-md"
                role="option"
                aria-selected={value === option}
              >
                <span
                  className={`block truncate ${
                    value === option ? "font-semibold" : "font-normal"
                  }`}
                >
                  {option}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomDropdown;
