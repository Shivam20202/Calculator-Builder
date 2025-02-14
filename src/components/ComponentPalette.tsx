import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Plus, Minus, X, Divide, Equal, RotateCcw } from 'lucide-react';

type PaletteItemProps = {
  type: string;
  value: string;
  icon?: React.ReactNode;
};

const PaletteItem = ({ type, value, icon }: PaletteItemProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `palette-${type}-${value}`,
    data: { type, value },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="p-2 m-1 bg-white dark:bg-gray-700 rounded shadow cursor-move hover:shadow-md transition-shadow dark:text-white flex items-center justify-center min-h-[40px]"
    >
      {icon || value}
    </div>
  );
};

export const ComponentPalette = () => {
  const numbers = Array.from({ length: 10 }, (_, i) => i.toString());
  const operators = [
    { value: '+', icon: <Plus className="w-5 h-5" /> },
    { value: '-', icon: <Minus className="w-5 h-5" /> },
    { value: '*', icon: <X className="w-5 h-5" /> },
    { value: '/', icon: <Divide className="w-5 h-5" /> },
  ];

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h2 className="text-lg font-semibold mb-4 dark:text-white">Components</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2 dark:text-gray-300">Numbers</h3>
          <div className="grid grid-cols-5 gap-1">
            {numbers.map((num) => (
              <PaletteItem key={num} type="number" value={num} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2 dark:text-gray-300">Operators</h3>
          <div className="grid grid-cols-4 gap-1">
            {operators.map((op) => (
              <PaletteItem key={op.value} type="operator" value={op.value} icon={op.icon} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2 dark:text-gray-300">Actions</h3>
          <div className="grid grid-cols-2 gap-1">
            <PaletteItem type="equals" value="=" icon={<Equal className="w-5 h-5" />} />
            <PaletteItem type="clear" value="C" icon={<RotateCcw className="w-5 h-5" />} />
          </div>
        </div>
      </div>
    </div>
  );
};