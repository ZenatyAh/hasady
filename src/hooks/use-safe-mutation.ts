import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { useCallback } from 'react';

/**
 * A wrapper around useMutation that prevents double submissions.
 * It strictly locks the mutate function if a mutation is already pending.
 */
export function useSafeMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> {
  const mutation = useMutation(options);
  const { isPending, mutate: baseMutate, mutateAsync: baseMutateAsync } = mutation;

  const mutate = useCallback(
    (...args: Parameters<typeof baseMutate>) => {
      if (isPending) {
        console.warn('[useSafeMutation] Double submission detected and blocked.');
        return;
      }
      return baseMutate(...args);
    },
    [baseMutate, isPending]
  );

  const mutateAsync = useCallback(
    (...args: Parameters<typeof baseMutateAsync>) => {
      if (isPending) {
        console.warn('[useSafeMutation] Double submission detected and blocked.');
        return Promise.reject(new Error('Double submission detected.'));
      }
      return baseMutateAsync(...args);
    },
    [baseMutateAsync, isPending]
  );

  return {
    ...mutation,
    mutate,
    mutateAsync,
  };
}
