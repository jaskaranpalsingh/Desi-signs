import { redirect } from 'next/navigation';

/** Quote requests are delivered by email/WhatsApp only — admin UI removed. */
export default function AdminQuotesRedirectPage() {
  redirect('/admin');
}
