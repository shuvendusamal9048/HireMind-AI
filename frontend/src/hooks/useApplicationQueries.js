import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService } from '../services/applicationService';
import toast from 'react-hot-toast';

export const useApplicationsQuery = (jobId = null) => {
  return useQuery({
    queryKey: ['applications', { jobId }],
    queryFn: () => {
      if (jobId) {
        return applicationService.getApplicationsByJob(jobId);
      }
      return applicationService.getApplications();
    },
  });
};

export const useApplicationQuery = (appId) => {
  return useQuery({
    queryKey: ['applications', appId],
    queryFn: () => applicationService.getApplicationById(appId),
    enabled: Boolean(appId),
  });
};

export const useShortlistMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (appId) => applicationService.shortlistCandidate(appId),
    onSuccess: (data, appId) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['applications', appId] });
      toast.success('Candidate shortlisted successfully.');
    },
  });
};

export const useRejectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (appId) => applicationService.rejectCandidate(appId),
    onSuccess: (data, appId) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['applications', appId] });
      toast.success('Candidate rejected.');
    },
  });
};

export const useScheduleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ appId, data }) => applicationService.scheduleInterview(appId, data),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['applications', variables.appId] });
      toast.success('AI Interview scheduled successfully & credentials generated!');
    },
  });
};

export const useGenerateInterviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (appId) => applicationService.generateInterview(appId),
    onSuccess: (res, appId) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['applications', appId] });
      toast.success('AI Interview generated successfully.');
    },
  });
};
