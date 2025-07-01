import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type VendorApplication = Database['public']['Tables']['vendor_applications']['Row'] & {
  applicant_profile?: {
    name: string;
    email: string;
  };
  reviewer_profile?: {
    name: string;
  };
};

export const useVendorApplications = () => {
  const [applications, setApplications] = useState<VendorApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('vendor_applications')
        .select(`
          *,
          applicant_profile:profiles!vendor_applications_user_id_fkey(name, email),
          reviewer_profile:profiles!vendor_applications_reviewed_by_fkey(name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
        return;
      }

      setApplications(data || []);
    } catch (err) {
      setError('Failed to fetch applications');
      console.error('Error fetching applications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateApplicationStatus = async (
    applicationId: string, 
    status: 'approved' | 'rejected', 
    notes?: string,
    reviewerId?: string
  ) => {
    try {
      const { error } = await supabase
        .from('vendor_applications')
        .update({
          status,
          notes: notes || null,
          reviewed_by: reviewerId || null,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (error) {
        console.error('Error updating application:', error);
        return false;
      }

      // If approved, update user role to vendor
      if (status === 'approved') {
        const application = applications.find(app => app.id === applicationId);
        if (application?.user_id) {
          const { error: roleError } = await supabase
            .from('profiles')
            .update({ role: 'vendor' })
            .eq('id', application.user_id);

          if (roleError) {
            console.error('Error updating user role:', roleError);
          }
        }
      }

      await fetchApplications();
      return true;
    } catch (err) {
      console.error('Error updating application:', err);
      return false;
    }
  };

  return { 
    applications, 
    isLoading, 
    error, 
    refetch: fetchApplications,
    updateApplicationStatus 
  };
};