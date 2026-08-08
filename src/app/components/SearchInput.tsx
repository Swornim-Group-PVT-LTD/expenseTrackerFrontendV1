"use client";

import { useState, useRef, useEffect } from "react";

interface SearchInputProps {
  options: { id: number; value: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({
  options,
  value,
  onChange,
  placeholder = "Type to search...",
  className = "",
}: SearchInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.value.toLowerCase().includes(value.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (inputValue: string) => {
    onChange(inputValue);
    setShowSuggestions(true);
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setShowSuggestions(false);
  };

  const displayOptions = value.length > 0 ? filteredOptions : options.slice(0, 5);

  return (
    <div className={`relative ${className}`} ref={inputRef}>
      <input
        type="text"
        className="w-full h-12 px-3 text-md font-bold text-[#716A6A] border border-[#574A4A]/50 rounded outline-none focus:border-[#FFA726] bg-white"
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
      />

      {showSuggestions && displayOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-[#574A4A]/50 rounded shadow-lg max-h-48 overflow-y-auto">
          {displayOptions.map((option) => (
            <div
              key={option.id}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
              onClick={() => handleSelect(option.value)}
            >
              {option.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}