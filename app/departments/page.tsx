'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { Department } from '../types';
import { Building2 } from 'lucide-react';

export default function DepartmentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => apiClient<{ data: Department[] }>('/departments'),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
        <p className="text-gray-500">View all hospital departments.</p>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data.map(dept => (
            <div key={dept.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Building2 size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{dept.name}</h3>
                <p className="text-sm text-gray-500">Department ID: {dept.id}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}