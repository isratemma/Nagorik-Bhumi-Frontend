import AuthLayout from '@/components/AuthLayout';
import Link from 'next/link';

export const metadata = { title: 'Terms of Service – Nagorik Bhumi' };

const sections = [
  { title: '1. Acceptance of Terms', body: 'By accessing and using Nagorik Bhumi, you agree to be bound by these Terms of Service. If you do not agree, please discontinue use immediately.' },
  { title: '2. Eligibility', body: 'You must be a Bangladeshi citizen aged 18 or above with a valid National ID (NID) to register and use this platform.' },
  { title: '3. User Responsibilities', body: 'You are responsible for maintaining the confidentiality of your account credentials. You must not share your password or OTP with anyone. Any activity under your account is your responsibility.' },
  { title: '4. Land Records & Data Accuracy', body: 'All land records submitted must be accurate and truthful. Submission of false or forged documents is a criminal offence under applicable Bangladeshi law and will result in immediate account suspension and legal action.' },
  { title: '5. Government Data', body: 'Nagorik Bhumi operates in partnership with Bangladesh Land Registry and Sub-Registrar offices. All official records are subject to government verification and approval processes.' },
  { title: '6. Intellectual Property', body: 'All content, logos, and designs on this platform are the intellectual property of Nagorik Bhumi / Ministry of Land, Bangladesh. Unauthorized reproduction is prohibited.' },
  { title: '7. Privacy', body: 'Your personal data is collected and processed in accordance with our Privacy Policy. We do not sell your data to third parties.' },
  { title: '8. Termination', body: 'We reserve the right to suspend or terminate any account that violates these terms, engages in fraudulent activity, or poses a security risk to the platform.' },
  { title: '9. Limitation of Liability', body: 'Nagorik Bhumi is not liable for any loss or damage arising from the use or inability to use the platform, including but not limited to service interruptions or data inaccuracies beyond our control.' },
  { title: '10. Changes to Terms', body: 'We may update these terms periodically. Continued use of the platform after changes constitutes acceptance of the revised terms.' },
  { title: '11. Governing Law', body: 'These terms are governed by the laws of the People\'s Republic of Bangladesh. Any disputes shall be resolved in the courts of Dhaka, Bangladesh.' },
  { title: '12. Contact', body: 'For any questions regarding these Terms, contact us at support@nagorikbhumi.gov.bd or call 16789.' },
];

export default function TermsPage() {
  return (
    <AuthLayout>
      <div className="card max-w-2xl w-full my-8">
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
          <div className="w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Terms of Service</h1>
            <p className="text-xs text-gray-400 mt-0.5">Last updated: January 2024 · Nagorik Bhumi</p>
          </div>
        </div>
        <div className="space-y-5">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="font-semibold text-gray-800 text-sm mb-1">{s.title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-5 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">© 2024 Nagorik Bhumi. All rights reserved.</p>
          <Link href="/register" className="text-sm text-brand font-semibold hover:underline">← Back to Register</Link>
        </div>
      </div>
    </AuthLayout>
  );
}
