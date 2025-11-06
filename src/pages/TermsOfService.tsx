import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/hooks/useLanguage";

const TermsOfService = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Acceptance of Terms</h2>
              <p>
                By accessing and using the ROOTSnROUTES platform, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of the materials on ROOTSnROUTES for personal, 
                non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
                <li>Attempt to decompile or reverse engineer any software contained on the platform</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">User Accounts</h2>
              <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times.</p>
              <p>You are responsible for:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Safeguarding the password and all activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use of your account</li>
                <li>Ensuring your account information remains accurate and up-to-date</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Booking and Payment Terms</h2>
              <p>When booking services through our platform:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>All prices are subject to change without notice</li>
                <li>Payment must be made in full at the time of booking</li>
                <li>Cancellation policies vary by service provider</li>
                <li>Refunds are subject to the terms of individual service providers</li>
                <li>Additional fees may apply for certain services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Content Guidelines</h2>
              <p>Users are prohibited from posting content that:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Is illegal, harmful, or offensive</li>
                <li>Violates any intellectual property rights</li>
                <li>Contains spam, advertisements, or solicitations</li>
                <li>Impersonates another person or entity</li>
                <li>Contains malicious code or viruses</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Privacy Policy</h2>
              <p>
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the platform, 
                to understand our practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Limitation of Liability</h2>
              <p>
                ROOTSnROUTES shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
                including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Termination</h2>
              <p>
                We may terminate or suspend your account and bar access to the platform immediately, without prior notice or liability, 
                under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Email: rootsnroutesofficial@gmail.com</li>
                <li>Phone: +91 9876543210</li>
                <li>Address: Ranchi, Jharkhand, India</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Last Updated: September 19, 2025
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;