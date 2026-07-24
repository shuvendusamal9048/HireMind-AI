import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';

export const useStatsQuery = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardService.getStats(),
  });
};

export const useStatusChartQuery = () => {
  return useQuery({
    queryKey: ['dashboard', 'status-chart'],
    queryFn: () => dashboardService.getStatusChart(),
  });
};

export const useTopCandidatesQuery = () => {
  return useQuery({
    queryKey: ['dashboard', 'top-candidates'],
    queryFn: () => dashboardService.getTopCandidates(),
  });
};
