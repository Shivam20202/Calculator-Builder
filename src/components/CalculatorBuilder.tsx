import React from 'react';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { ComponentPalette } from './ComponentPalette';
import { CalculatorGrid } from './CalculatorGrid';
import { useCalculatorStore } from '../store/calculatorStore';
import { Moon, Sun } from 'lucide-react';

export const CalculatorBuilder = () => {
  const { isDarkMode, toggleDarkMode, handleNewComponent } = useCalculatorStore();
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
  
    if (!over) return;
  
    if (active.id.toString().startsWith('palette-')) {
      const parts = active.id.toString().split('-');
      
      if (parts.length < 3) {
        console.warn("⚠️ Skipping invalid component:", { id: active.id, parts });
        return; // Prevent adding invalid components
      }
  
      const type = parts[1];
      let value = parts.slice(2).join('-'); // Ensure full value extraction
  
      if (type === 'operator' && !value) {
        console.warn("⚠️ Skipping invalid operator component:", { id: active.id, type, value });
        return;
      }
  
      const newComponent = {
        id: `calc-${Date.now()}`,
        type: type as any,
        value: value,
      };
  
      handleNewComponent(newComponent);
    }
  };
  

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Calculator Builder
            </h1>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isDarkMode ? <Sun className="text-white" /> : <Moon />}
            </button>
          </div>

          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <ComponentPalette />
              </div>
              <div className="md:col-span-2">
                <CalculatorGrid />
              </div>
            </div>
          </DndContext>
        </div>
      </div>
    </div>
  );
};