import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { DcfInputs } from '../features/dcf/presets';

/**
 * Hook to calculate hidden values from the backend
 * Note: This hook is prepared for backend integration but the backend
 * method signature needs to be updated to accept DcfInputs
 */
export function useBackendCalculation(inputs: DcfInputs) {
  const { actor, isFetching: isActorFetching } = useActor();

  return useQuery({
    queryKey: ['backendCalculation', inputs],
    queryFn: async () => {
      if (!actor) {
        throw new Error('Actor not initialized');
      }

      // TODO: Once backend is updated with the correct method signature,
      // call it here with the full inputs object
      // For now, return null to indicate calculations are not yet available
      // from the backend
      
      // Expected backend call (once implemented):
      // return await actor.calculateHiddenValues(inputs);
      
      return null;
    },
    enabled: !!actor && !isActorFetching,
    // Keep data fresh but don't refetch too aggressively
    staleTime: 30000, // 30 seconds
  });
}
