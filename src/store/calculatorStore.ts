import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CalculatorState, CalculatorComponent } from '../types/calculator';

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set, get) => ({
      components: [],
      displayValue: '0',
      previousValue: null,
      operator: null,
      isDarkMode: false,

      handleNewComponent: (component) => {
        if (!component.value) {
          console.error('⚠️ Received empty value for component:', component);
          return;
        }

        if (component.type === 'number') {
          if (get().displayValue === '0' || get().displayValue === 'Error') {
            set({ displayValue: component.value });
          } else {
            set({ displayValue: get().displayValue + component.value });
          }
        } else if (component.type === 'operator') {
          set({
            previousValue: get().displayValue,
            operator: component.value,
            displayValue: '0'
          });
        } else if (component.type === 'equals') {
          get().calculate();
        } else if (component.type === 'clear') {
          get().clearCalculator();
        }

        set((state) => ({
          components: [...state.components, component],
        }));
      },

      addComponent: (component) =>
        set((state) => ({
          components: [...state.components, component],
        })),

      removeComponent: (id) =>
        set((state) => ({
          components: state.components.filter((c) => c.id !== id),
        })),

      updateComponents: (components) =>
        set(() => ({
          components,
        })),

        calculate: () => {
          const { previousValue, displayValue, operator } = get();
          if (!previousValue || !operator) return;
  
          const prev = parseFloat(previousValue);
          const current = parseFloat(displayValue);
          let result: number;
  
          try {
            switch (operator) {
              case '+': result = prev + current; break;
              case '-': result = prev - current; break;
              case '*': result = prev * current; break;
              case '/':
                if (current === 0) throw new Error('Division by zero');
                result = prev / current;
                break;
              default: return;
            }

          // Handle potential floating point precision issues
          const formattedResult = Number.isInteger(result) 
            ? result.toString()
            : result.toFixed(8).replace(/\.?0+$/, '');

          set({
            displayValue: formattedResult,
            previousValue: null,
            operator: null,
          });
        } catch (error) {
          set({
            displayValue: 'Error',
            previousValue: null,
            operator: null,
          });
        }
      },

      setDisplayValue: (value) => set({ displayValue: value }),
      setPreviousValue: (value) => set({ previousValue: value }),
      setOperator: (operator) => set({ operator }),
      clearCalculator: () =>
        set({
          displayValue: '0',
          previousValue: null,
          operator: null,
        }),
      toggleDarkMode: () =>
        set((state) => ({
          isDarkMode: !state.isDarkMode,
        })),
    }),
    {
      name: 'calculator-storage',
    }
  )
);