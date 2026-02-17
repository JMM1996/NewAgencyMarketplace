export const metadata = {
  title: 'Privacy Policy | Clovia',
  description: 'How Clovia collects, uses, and protects your personal data.',
}

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 to-teal-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-teal-100">
            Last updated: February 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-gray max-w-none">
            <h2>1. Introduction</h2>
            <p>
              Clovia Ltd (&quot;Clovia&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you use our platform.
            </p>
            <p>
              By using Clovia, you consent to the data practices described in this policy. If you do not
              agree with the terms of this privacy policy, please do not access the platform.
            </p>

            <h2>2. Information We Collect</h2>

            <h3>2.1 Personal Information</h3>
            <p>We collect personal information that you voluntarily provide to us when you:</p>
            <ul>
              <li>Register for an account</li>
              <li>Create or update your profile</li>
              <li>Apply for or post shifts</li>
              <li>Contact us for support</li>
            </ul>
            <p>This information may include:</p>
            <ul>
              <li>Name, email address, phone number</li>
              <li>Address and location preferences</li>
              <li>Professional qualifications and experience</li>
              <li>DBS certificate details</li>
              <li>Right to work documentation</li>
              <li>Insurance policy information</li>
              <li>Bank account details for payments</li>
              <li>Care home registration and CQC details</li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <p>When you access our platform, we may automatically collect:</p>
            <ul>
              <li>Device information (browser type, operating system)</li>
              <li>IP address and location data</li>
              <li>Usage data (pages visited, features used)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, operate, and maintain our platform</li>
              <li>Verify your identity and compliance documents</li>
              <li>Connect care professionals with care homes</li>
              <li>Process payments and manage billing</li>
              <li>Send administrative notifications and updates</li>
              <li>Respond to your enquiries and provide support</li>
              <li>Improve our platform and develop new features</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>4. How We Share Your Information</h2>

            <h3>4.1 With Other Users</h3>
            <p>
              Care professionals: Your profile information (excluding sensitive documents) is visible to
              care homes when you apply for shifts. Care homes can see your name, experience, qualifications,
              ratings, and verification status.
            </p>
            <p>
              Care homes: Your facility details and shift requirements are visible to verified care professionals.
            </p>

            <h3>4.2 With Service Providers</h3>
            <p>
              We may share your information with third-party service providers who perform services on our
              behalf, such as payment processing, email delivery, and hosting services.
            </p>

            <h3>4.3 Legal Requirements</h3>
            <p>
              We may disclose your information if required to do so by law or in response to valid requests
              by public authorities.
            </p>

            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organisational measures to protect your personal
              information against unauthorised access, alteration, disclosure, or destruction. However,
              no method of transmission over the Internet is 100% secure.
            </p>

            <h2>6. Data Retention</h2>
            <p>
              We retain your personal information for as long as your account is active or as needed to
              provide you services. We may also retain certain information as required by law or for
              legitimate business purposes.
            </p>

            <h2>7. Your Rights</h2>
            <p>Under UK data protection law, you have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Request restriction of processing</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p>
              To exercise these rights, please contact us at{' '}
              <a href="mailto:privacy@clovia.uk" className="text-teal-600 hover:underline">privacy@clovia.uk</a>.
            </p>

            <h2>8. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience on our platform.
              You can control cookies through your browser settings. Essential cookies are necessary for
              the platform to function and cannot be disabled.
            </p>

            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by
              posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>

            <h2>10. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p>
              Email: <a href="mailto:privacy@clovia.uk" className="text-teal-600 hover:underline">privacy@clovia.uk</a><br />
              Clovia Ltd<br />
              Registered in England & Wales
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
