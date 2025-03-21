import { useQuery } from '@tanstack/react-query';
import { getActiveSlidesCached, Slide } from '@/lib/contentful-sliders';

/**
 * React Query hook for fetching active slides for sliders
 * 
 * @returns Query object containing slider data
 */
export function useSliders() {
  return useQuery<Slide[]>({
    queryKey: ['sliders'],
    queryFn: () => getActiveSlidesCached(),
    staleTime: 5 * 60 * 1000, // 5 minutes (same as cache duration)
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
} 