import { useCallback, useState } from 'react';

interface UseControllableStateOptions<T> {
  /** When defined, the parent owns the state and the hook never stores its own. */
  value: T | undefined;
  /** Starting value for uncontrolled use. Ignored once mounted. */
  defaultValue: T;
  /** Called with the next value every time the state is asked to change. */
  onChange?: (next: T) => void;
}

/**
 * Lets a component work both ways: uncontrolled (it owns the state) or
 * controlled (the parent owns it). The component only ever calls `setValue`,
 * and doesn't need to know which mode it's in.
 *
 * Caveat: don't switch a component between controlled and uncontrolled after it
 * mounts. React warns about this for native inputs for the same reason.
 */
export function useControllableState<T>({ value, defaultValue, onChange }: UseControllableStateOptions<T>) {
  const [internalValue, setInternalValue] = useState<T>(defaultValue);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) {
        setInternalValue(next);
      }
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  return [currentValue, setValue] as const;
}
