'use client';

import { useQuery } from '@tanstack/react-query';
import { 
  getAllBlogPosts, 
  getBlogPostBySlug, 
  getBlogPostsByCategory, 
  getFeaturedBlogPosts,
  getAllTeamMembers,
  getTeamMemberBySlug,
  getFeaturedTeamMembers,
  getAllServices,
  getServiceBySlug,
  getBlogCategories
} from '@/lib/contentful';
import { BlogPost, TeamMember, Service, PaginatedResponse } from '@/lib/contentful';

// Category interface
export interface Category {
  name: string;
  count: number;
}

// Blog post queries
export function useAllBlogPosts(page: number = 1, perPage: number = 9) {
  return useQuery<PaginatedResponse<BlogPost>, Error>({
    queryKey: ['blogPosts', page, perPage],
    queryFn: () => getAllBlogPosts(page, perPage),
  });
}

export function useBlogPostBySlug(slug: string) {
  return useQuery<BlogPost | null, Error>({
    queryKey: ['blogPost', slug],
    queryFn: () => getBlogPostBySlug(slug),
    enabled: !!slug,
  });
}

export function useBlogPostsByCategory(category: string, page: number = 1, perPage: number = 9) {
  console.log('category in use-', category)
  return useQuery<PaginatedResponse<BlogPost>, Error>({
    queryKey: ['blogPosts', 'category', category, page, perPage],
    queryFn: () => getBlogPostsByCategory(category, page, perPage),
    enabled: !!category,
  });
}

export function useFeaturedBlogPosts(page: number = 1, perPage: number = 9) {
  return useQuery<PaginatedResponse<BlogPost>, Error>({
    queryKey: ['blogPosts', 'featured', page, perPage],
    queryFn: () => getFeaturedBlogPosts(page, perPage),
  });
}

export function useBlogCategories() {
  return useQuery<Category[], Error>({
    queryKey: ['blogCategories'],
    queryFn: () => getBlogCategories(),
  });
}

// Team member queries
export function useAllTeamMembers() {
  return useQuery<TeamMember[], Error>({
    queryKey: ['teamMembers'],
    queryFn: () => getAllTeamMembers(),
  });
}

export function useTeamMemberBySlug(slug: string) {
  return useQuery<TeamMember | null, Error>({
    queryKey: ['teamMember', slug],
    queryFn: () => getTeamMemberBySlug(slug),
    enabled: !!slug,
  });
}

export function useFeaturedTeamMembers() {
  return useQuery<TeamMember[], Error>({
    queryKey: ['teamMembers', 'featured'],
    queryFn: () => getFeaturedTeamMembers(),
  });
}

// Service queries
export function useAllServices() {
  return useQuery<Service[], Error>({
    queryKey: ['services'],
    queryFn: () => getAllServices(),
  });
}

export function useServiceBySlug(slug: string) {
  return useQuery<Service | null, Error>({
    queryKey: ['service', slug],
    queryFn: () => getServiceBySlug(slug),
    enabled: !!slug,
  });
} 