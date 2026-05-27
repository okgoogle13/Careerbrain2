import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TextInput } from "./TextInput";

type Props = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  suggestions: string[];
};

export function AutocompleteInput({ label, placeholder, value, onChange, onEnter, suggestions }: Props) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.trim() === "") {
      setFilteredSuggestions([]);
      return;
    }

    const filtered = suggestions.filter(
      (s) => s.toLowerCase().includes(value.toLowerCase()) && s.toLowerCase() !== value.toLowerCase()
    ).slice(0, 5);
    setFilteredSuggestions(filtered);
  }, [value, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        e.preventDefault();
        handleSelect(filteredSuggestions[activeIndex]);
      } else if (onEnter) {
        e.preventDefault();
        onEnter();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleSelect = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    setActiveIndex(-1);
  };

  return (
    <div className="relative" ref={containerRef}>
      <TextInput
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
          setActiveIndex(-1);
        }}
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={handleKeyDown}
      />
      
      <AnimatePresence>
        {showSuggestions && value.trim() !== "" && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-[var(--sys-color-charcoalBackground-steps-2)] border border-[var(--sys-color-outline-variant)] shadow-[var(--sys-shadow-elevation3HoverLift)] overflow-hidden"
            style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
          >
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((suggestion, index) => (
                <li
                  key={suggestion}
                  onClick={() => handleSelect(suggestion)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`p-4 cursor-pointer transition-colors text-sm font-bold ${
                    index === activeIndex 
                      ? 'bg-[var(--sys-color-solidarityRed-base)] text-[var(--sys-color-paperWhite-base)]' 
                      : 'text-[var(--sys-color-worker-ash-base)] hover:bg-[var(--sys-color-charcoalBackground-steps-3)]'
                  }`}
                >
                  {suggestion}
                </li>
              ))
            ) : (
              <li className="p-4 text-[var(--sys-color-worker-ash-base)] italic text-sm">
                No matching skills found. Press enter to add.
              </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
