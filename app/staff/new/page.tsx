import { StaffForm } from '@/app/components/StaffForm';
import Link from 'next/link';

export default function NewStaffPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-gray-500 hover:text-gray-900">
          &larr; Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create New Staff</h1>
      </div>
      <StaffForm />
    </div>
  );
}