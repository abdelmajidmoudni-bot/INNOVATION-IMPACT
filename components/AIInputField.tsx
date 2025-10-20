import React, { useState, useEffect } from 'react';
import { generateContentForField } from '../services/geminiService';
import { SparklesIcon, LoadingSpinner } from './icons';

interface AIInputFieldProps {
  label: string;
  name: string;
  initialValue?: string;
  onValueChange: (name: string, value: string) => void;
  context: any; // Context data for generating the prompt
  placeholder?: string;
  textarea?: boolean;
  required?: boolean;
  rows?: number;
}

export const AIInputField: React.FC<AIInputFieldProps> = ({
  label,
  name,
  initialValue = '',
  onValueChange,
  context,
  placeholder,
  textarea = false,
  required = false,
  rows = 5,
}) => {
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);
    onValueChange(name, e.target.value);
  }

  const handleGenerateClick = async () => {
    setIsLoading(true);
    try {
      const result = await generateContentForField(name, { ...context, currentValue: value });
      setValue(result);
      onValueChange(name, result);
    } catch (error) {
      console.error("Failed to generate content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const InputComponent = textarea ? 'textarea' : 'input';
  const commonProps = {
    id: name,
    name,
    value,
    onChange: handleChange,
    placeholder,
    required,
    className: 'w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm pr-10',
    rows: textarea ? rows : undefined,
  };

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <InputComponent {...commonProps} />
        <button
          type="button"
          onClick={handleGenerateClick}
          disabled={isLoading}
          className="absolute top-2.5 right-2.5 p-1 bg-primary-100 text-primary-600 rounded-full hover:bg-primary-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
          title="Générer avec l'IA"
        >
          {isLoading ? <LoadingSpinner className="w-4 h-4" /> : <SparklesIcon className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
