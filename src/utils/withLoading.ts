import { useAuthStore } from "../stores/useAuthStore";

/**
 * Wraps an async function with loading state management.
 * Automatically sets isLoading to true before the call and false after.
 * Can be used in any store or component.
 * 
 * @example
 * // Direct call with arguments
 * const data = await withLoading(
 *   async (id: string) => supabase.from('users').select('*').eq('id', id),
 *   'user-123'
 * );
 * 
 * @example
 * // Return wrapped function (for store methods)
 * setData: withLoading(async (userId: string) => {
 *   const { data } = await supabase.from('users').select('*').eq('id', userId);
 *   return data;
 * })
 */

// Overload 1: When called with just a function, return a wrapped function
export function withLoading<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>
): (...args: Args) => Promise<T>;

// Overload 2: When called with function and arguments, execute immediately
export function withLoading<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  ...args: Args
): Promise<T>;

// Implementation
export function withLoading<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  ...args: Args
): Promise<T> | ((...args: Args) => Promise<T>) {
  // If no arguments provided, return a wrapped function
  if (args.length === 0) {
    return async (...callArgs: Args): Promise<T> => {
      const setState = useAuthStore.setState;
      setState({ isLoading: true });
      
      try {
        const result = await fn(...callArgs);
        return result;
      } finally {
        setState({ isLoading: false });
      }
    };
  }
  
  // If arguments provided, execute immediately
  const setState = useAuthStore.setState;
  setState({ isLoading: true });
  
  const execute = async (): Promise<T> => {
    try {
      const result = await fn(...args);
      return result;
    } finally {
      setState({ isLoading: false });
    }
  };
  
  return execute();
}
