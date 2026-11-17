'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from './lib/api';
import { SearchStaffResponse } from './types';
import Link from 'next/link';
import { TableSkeleton } from './components/Skeleton';
import { Search, Plus } from 'lucide-react';

export default function StaffDirectory() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const limit = 10;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['staff', page, search],
    queryFn: () =>
      apiClient<SearchStaffResponse>(
        `/staff/search?page=${page}&limit=${limit}&search=${search}`
      ),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Directory</h1>
          <p className="text-gray-500">Manage hospital staff and assignments.</p>
        </div>
        <Link
          href="/staff/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={18} />
          Add Staff
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by name or email..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset to first page on search
          }}
        />
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton />
          </div>
        ) : isError ? (
          <div className="p-12 text-center text-red-600">
            <p>Error loading staff: {error.message}</p>
          </div>
        ) : data?.data.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No staff members found.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.data.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/staff/${staff.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                      {staff.first_name} {staff.last_name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                      {staff.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {staff.department ? (
                      <span className="text-gray-900">{staff.department.name}</span>
                    ) : (
                      <span className="text-gray-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {staff.email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {data && data.meta.total > 0 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(page * limit, data.meta.total)}
                  </span>{' '}
                  of <span className="font-medium">{data.meta.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page * limit >= data.meta.total}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}