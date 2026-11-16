// app/professional/onboarding/page.tsx
import { ProfessionalOnboardingForm } from '@/components/onboarding/professional-form';
import { ServiceForm } from '@/components/onboarding/service-form';
import { PortfolioForm } from '@/components/onboarding/portfolio-form';

export default function ProfessionalOnboardingPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
      <h1 className="text-3xl font-bold text-navy-900 mb-8">Complete Your Onboarding</h1>
      <div className="space-y-6">
        <ProfessionalOnboardingForm />
        <ServiceForm />
        <PortfolioForm />
      </div>
      <button className="bg-emerald-600 text-white px-6 py-3 rounded-md hover:bg-emerald-700">
        Submit for Review
      </button>
    </div>
  );
}