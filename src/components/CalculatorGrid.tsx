import React, { useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useCalculatorStore } from '../store/calculatorStore';
import { Plus, Minus, X, Divide, Equal, RotateCcw } from 'lucide-react';

export const CalculatorGrid = () => {
  const {
    components,
    displayValue,
    setDisplayValue,
    setPreviousValue,
    setOperator,
    calculate,
    clearCalculator,
    removeComponent,
    operator,
  } = useCalculatorStore();

  const { setNodeRef } = useDroppable({
    id: 'calculator-grid',
  });

  const handleNumberClick = (value: string) => {
    if (displayValue === '0' || displayValue === 'Error') {
      setDisplayValue(value);
    } else {
      setDisplayValue(displayValue + value);
    }
  };

  const handleOperatorClick = (op: string) => {
    if (!op) {
      console.error('⚠️ Invalid operator received:', op);
      return;
    }

    if (displayValue !== 'Error') {
      setPreviousValue(displayValue);
      setOperator(op);
      setDisplayValue('0');
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        handleNumberClick(e.key);
      } else if (['+', '-', '*', '/'].includes(e.key)) {
        handleOperatorClick(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        calculate();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        clearCalculator();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [displayValue, operator]);

  const getComponentIcon = (type: string, value: string) => {
    switch (value) {
      case '+':
        return <Plus className="w-5 h-5" />;
      case '-':
        return <Minus className="w-5 h-5" />;
      case '*':
        return <X className="w-5 h-5" />;
      case '/':
        return <Divide className="w-5 h-5" />;
      case '=':
        return <Equal className="w-5 h-5" />;
      case 'C':
        return <RotateCcw className="w-5 h-5" />;
      default:
        return value;
    }
  };

  const renderComponent = (component: any) => {
    if (component.type === 'operator' && !component.value) {
      console.error('⚠️ Operator component has no value!', component);
    }

    const baseClasses =
      'p-4 m-1 rounded-lg shadow hover:shadow-md transition-all text-center cursor-pointer relative group flex items-center justify-center';

    const getSpecificClasses = () => {
      switch (component.type) {
        case 'number':
          return 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-lg font-medium';
        case 'operator':
          return 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700';
        case 'equals':
          return 'bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700';
        case 'clear':
          return 'bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700';
        default:
          return 'bg-white dark:bg-gray-700 dark:text-white';
      }
    };

    const handleClick = () => {
      switch (component.type) {
        case 'number':
          handleNumberClick(component.value);
          break;
        case 'operator':
          handleOperatorClick(component.value);
          break;
        case 'equals':
          calculate();
          break;
        case 'clear':
          clearCalculator();
          break;
      }
    };

    return (
      <div
        key={component.id}
        className={`${baseClasses} ${getSpecificClasses()}`}
        onClick={handleClick}
      >
        {getComponentIcon(component.type, component.value || '?')}
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeComponent(component.id);
          }}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      </div>
    );
  };

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg min-h-[500px]"
    >
      <div className="mb-4 p-4 bg-white dark:bg-gray-700 rounded-lg shadow text-right text-2xl font-mono h-16 flex items-center justify-end px-6 text-gray-900 dark:text-white">
        {displayValue}
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {components.map(renderComponent)}
      </div>
      
      {components.length === 0 && (
        <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
          Drag and drop components here to build your calculator
        </div>
      )}
    </div>
  );
};
