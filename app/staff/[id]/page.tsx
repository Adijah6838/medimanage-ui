'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/app/lib/api';
import { Staff, Department } from '@/app/types';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function StaffProfile() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedDept, setSelectedDept] = useState<string>('');
  
  // Fetch staff member using the new endpoint
  const { data: staff, isLoading } = useQuery({
    queryKey: ['staff', id],
    queryFn: () => apiClient<Staff>(`/staff/${id}`),
  });

  // Fetch departments for the assignment dropdown
  const { data: deptData } = useQuery({
    queryKey: ['departments'],
    queryFn: () => apiClient<{ data: Department[] }>('/departments'),
  });

  // Mutation for assigning department
  const mutation = useMutation({
    mutationFn: (deptId: number) =>
      apiClient(`/staff/${id}/department`, {
        method: 'PUT',
        body: JSON.stringify({ department_id: deptId }),
      }),
    onSuccess: () => {
      // Invalidate both the staff member and the global staff list
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      alert('Department assigned successfully!');
    },
    onError: (error: any) => {
      alert(`Error assigning department: ${error.message}`);
    }
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="h-48 bg-gray-200 rounded-xl"></div>
        <div className="h-32 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Staff member not found</h2>
        <Link href="/" className="text-blue-600 hover:underline">← Back to Directory</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/" className="text-blue-600 hover:underline text-sm inline-block mb-2">
        &larr; Back to Directory
      </Link>
      
      {/* Profile Card */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {staff.first_name} {staff.last_name}
            </h1>
            <p className="text-gray-500 mb-6">{staff.email}</p>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold capitalize">
            {staff.role}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
          <div>
            <span className="block text-sm text-gray-500 mb-1">Current Department</span>
            <span className="font-medium text-lg">
              {staff.department?.name || <span className="text-gray-400 italic">Unassigned</span>}
            </span>
          </div>
          <div>
            <span className="block text-sm text-gray-500 mb-1">Staff ID</span>
            <span className="font-medium text-lg">#{staff.id}</span>
          </div>
        </div>
      </div>

      {/* Assignment Card */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Assign Department</h2>
        <p className="text-sm text-gray-500 mb-4">Select a department to assign this staff member.</p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <select 
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="">Select a department...</option>
            {deptData?.data.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <button
            onClick={() => mutation.mutate(Number(selectedDept))}
            disabled={!selectedDept || mutation.isPending}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors"
          >
            {mutation.isPending ? 'Assigning...' : 'Assign Department'}
          </button>
        </div>
      </div>
    </div>
  );
}