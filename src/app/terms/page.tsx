export default function TermsPage() {
  return (
    <div className="pt-28 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-8 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-primary mb-8">
        Terms &amp; Conditions
      </h1>

      <div className="prose prose-sm max-w-none text-on-surface space-y-6">
        <p className="text-on-surface-variant text-sm italic">
          Last updated: April 2026. This is a preliminary document and will be updated before the site is open to customers.
        </p>

        <section>
          <h2 className="text-xl font-headline text-primary mt-8 mb-3">1. General</h2>
          <p>
            By accessing and using Auric Krystals (&quot;the Site&quot;), you agree to be bound by these
            Terms &amp; Conditions. If you do not agree, please do not use this Site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-headline text-primary mt-8 mb-3">2. Products &amp; Services</h2>
          <p>
            All products listed are subject to availability. Prices are displayed in Indian Rupees (INR)
            and may change without prior notice. Crystal properties described are based on traditional
            beliefs and are not medical claims.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-headline text-primary mt-8 mb-3">3. Orders &amp; Payment</h2>
          <p>
            Orders are confirmed only after payment verification by our team. Payment is accepted via UPI.
            We reserve the right to cancel or refuse any order at our discretion.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-headline text-primary mt-8 mb-3">4. Shipping &amp; Delivery</h2>
          <p>
            We ship across India. Delivery timelines vary by location and will be communicated at the time
            of order confirmation. Shipping charges, if any, will be displayed during checkout.
          </p>
        </section>

        <section id="privacy">
          <h2 className="text-xl font-headline text-primary mt-8 mb-3">5. Privacy Policy</h2>
          <p>
            We collect personal information (name, email, phone, date of birth, address) solely for the
            purpose of processing orders, personalizing your experience, and communicating updates you
            have opted into.
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Your data is stored securely and is never sold to third parties.</li>
            <li>Marketing communications are sent only if you explicitly opt in.</li>
            <li>You may request deletion of your data at any time by contacting us.</li>
            <li>
              We comply with applicable Indian data protection regulations including the Digital Personal
              Data Protection Act, 2023 (DPDP Act) provisions.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-headline text-primary mt-8 mb-3">6. Contact</h2>
          <p>
            For questions about these terms or your data, contact us at{" "}
            <a href="mailto:astrokrupa16@gmail.com" className="text-primary underline">
              astrokrupa16@gmail.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
