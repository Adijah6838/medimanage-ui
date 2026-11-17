'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { useRouter } from 'next/navigation';
import { Staff } from '../types';
import { useState } from 'react';

const staffSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['doctor', 'nurse', 'admin'], {
    message: 'Please select a valid role',
  }),
});

type StaffFormValues = z.infer<typeof staffSchema>;

export function StaffForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      role: 'doctor',
    },
  });

  const mutation = useMutation({
    mutationFn: (newStaff: StaffFormValues) =>
      apiClient<Staff>('/staff', {
        method: 'POST',
        body: JSON.stringify(newStaff),
      }),
    onMutate: async (newStaff) => {
      // Optimistic Update
      await queryClient.cancelQueries({ queryKey: ['staff'] });
      const previousStaff = queryClient.getQueryData(['staff']);

      // Optimistically add the new staff to the cache
      queryClient.setQueryData(['staff'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: [
            { ...newStaff, id: Date.now(), department_id: null }, // Temporary ID
            ...old.data,
          ],
        };
      });

      return { previousStaff };
    },
    onError: (err: any, newStaff, context) => {
      // Rollback on error
      if (context?.previousStaff) {
        queryClient.setQueryData(['staff'], context.previousStaff);
      }
      setApiError(err.message || 'Failed to create staff member');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      router.push('/');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });

  const onSubmit = (data: StaffFormValues) => {
    setApiError(null);
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      {apiError && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
          {apiError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input
            {...register('first_name')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="John"
          />
          {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
            {...register('last_name')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Doe"
          />
          {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input
          {...register('email')}
          type="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="john@hospital.com"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
        <select
          {...register('role')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="doctor">Doctor</option>
          <option value="nurse">Nurse</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || mutation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
        >
          {isSubmitting || mutation.isPending ? 'Saving...' : 'Save Staff'}
        </button>
      </div>
    </form>
  );
}