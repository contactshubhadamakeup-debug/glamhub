// app/enquiry/[professionalId]/page.tsx
import { EnquiryForm } from '@/components/enquiries/enquiry-form';

export default function EnquiryPage({
  params,
}: {
  params: { professionalId: string };
}) {
  return <EnquiryForm professionalId={params.professionalId} />;
}