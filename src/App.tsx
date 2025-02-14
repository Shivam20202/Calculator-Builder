import React from 'react';
import { CalculatorBuilder } from './components/CalculatorBuilder';
import { useCalculatorStore } from './store/calculatorStore';

function App() {
  const isDarkMode = useCalculatorStore((state) => state.isDarkMode);

  return (
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen bg-gray-100 dark:bg-gray-900`}>
      <CalculatorBuilder />
    </div>
  );
}

export default App;