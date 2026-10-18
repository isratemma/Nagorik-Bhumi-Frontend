import AuthLayout from '@/components/AuthLayout';
import Link from 'next/link';

export const metadata = { title: 'Privacy Policy – Nagorik Bhumi' };

const sections = [
  { title: '1. Information We Collect', body: 'We collect your full name, National ID (NID) number, date of birth, mobile number, email address, and land ownership documents when you register and use our services.' },
  { title: '2. How We Use Your Information', body: 'Your information is used to verify your identity, process land record applications, send notifications, provide customer support, and comply with legal obligations under Bangladeshi law.' },
  { title: '3. Data Sharing', body: 'We share your data only with government land registry authorities and sub-registrar offices as required for service delivery. We do not sell or rent your personal data to any third party.' },
  { title: '4. Data Security', body: 'All data is encrypted in transit and at rest. We implement industry-standard security measures including SSL/TLS encryption, access controls, and regular security audits to protect your information.' },
  { title: '5. NID Verification', body: 'Your NID is verified against the Bangladesh National Identity Registration Authority (NIDW) database. This verification is a one-time process and the NID number is stored securely with restricted access.' },
  { title: '6. Cookies', body: 'We use essential cookies to maintain your session and preferences. We do not use tracking or advertising cookies.' },
  { title: '7. Data Retention', body: 'Your account data is retained as long as your account is active. Land records are retained permanently as they are official government documents. You may request deletion of personal account data by contacting support.' },
  { title: '8. Your Rights', body: 'You have the right to access, correct, or request deletion of your personal data. You may also request a copy of your data in a portable format by contacting our support team.' },
  { title: '9. Children\'s Privacy', body: 'Nagorik Bhumi is not intended for use by individuals under 18 years of age. We do not knowingly collect data from minors.' },
  { title: '10. Changes to This Policy', body: 'We may update this Privacy Policy from time to time. We will notify you of significant changes via email or an in-app notification.' },
  { title: '11. Contact Us', body: 'If you have questions about this Privacy Policy or how your data is handled, contact our Data Protection Officer at privacy@nagorikbhumi.gov.bd or call 16789.' },
];

export default function PrivacyPage() {
  return (
    <AuthLayout>
      <div className="card max-w-2xl w-full my-8">
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Privacy Policy</h1>
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
