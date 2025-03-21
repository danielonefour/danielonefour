import { useQuery } from '@tanstack/react-query';
import { getCompanyDetailsCached, CompanyDetails } from '@/lib/contentful-company-details';

/**
 * React Query hook for fetching company details
 * 
 * @returns Query object containing company details data
 */
export function useCompanyDetails() {
  return useQuery<CompanyDetails | null>({
    queryKey: ['companyDetails'],
    queryFn: () => getCompanyDetailsCached(),
    staleTime: 60 * 60 * 1000, // 1 hour (same as cache duration)
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
} 