import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobService } from '../services/jobService';
import toast from 'react-hot-toast';

export const useJobsQuery = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: () => jobService.getJobs(),
  });
};

export const useJobQuery = (jobId) => {
  return useQuery({
    queryKey: ['jobs', jobId],
    queryFn: () => jobService.getJobById(jobId),
    enabled: Boolean(jobId),
  });
};

export const useCreateJobMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => jobService.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job posting created successfully!');
    },
  });
};

export const useUpdateJobMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, data }) => jobService.updateJob(jobId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs', variables.jobId] });
      toast.success('Job details updated successfully!');
    },
  });
};

export const useDeleteJobMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId) => jobService.deleteJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job position deleted successfully.');
    },
  });
};
