import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { defaultSettings } from './siteConfig';

export function useSiteSettings() {
  const { data, isLoading } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const items = await base44.entities.SiteSettings.list();
      if (items && items.length > 0) {
        return { ...defaultSettings, ...items[0] };
      }
      return { ...defaultSettings, _id: null };
    },
    staleTime: 60000,
  });
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
  return { settings: data || defaultSettings, isLoading, invalidate };
}