import { redirect } from 'next/navigation';

/**
 * Contact enquiries are delivered to Save@desisigns.com by email.
 * Historical MongoDB records are preserved; this UI is no longer exposed.
 */
export default function AdminInquiriesPage() {
  redirect('/admin');
}
