import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/privacy-policy")({
  component: PrivacyPolicyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy - Zuridoc" },
      {
        name: "description",
        content: "Learn how Zuridoc collects, uses, protects, and manages personal information.",
      },
    ],
  }),
});

const sections = [
  {
    title: "Our Core Privacy Principles",
    body: "Zuridoc is guided by data minimization, purpose limitation, and transparency. We collect only the information needed to provide and improve our services, use it for clear and legitimate purposes, and keep users informed about how their information is handled.",
  },
  {
    title: "Information We Collect",
    body: "We may collect information you provide directly, such as your name, contact details, account credentials, uploaded logos, company details, and communications with support. We may also collect technical information such as IP address, browser type, device identifiers, and usage patterns to maintain security, stability, and performance.",
  },
  {
    title: "How We Use Information",
    body: "We use information to deliver our document creation services, authenticate accounts, process user requests, improve product quality, communicate account updates, and protect the platform from misuse. Aggregated or anonymized data may be used to understand trends and improve functionality.",
  },
  {
    title: "Cookies and Tracking Technologies",
    body: "Zuridoc may use cookies and similar technologies to keep sessions secure, remember preferences, understand site usage, and improve the user experience. Users can manage or disable cookies through browser settings, though some features may require essential cookies to function.",
  },
  {
    title: "Data Sharing and Third Parties",
    body: "We do not sell personal information. We may share limited data with trusted service providers who help us operate the platform, provide infrastructure, process authentication, or deliver support. These providers are permitted to use data only for the services they provide to Zuridoc. We may also disclose information when required by law or to protect rights, property, safety, and platform integrity.",
  },
  {
    title: "Data Security",
    body: "We use reasonable technical and organizational safeguards to protect information from unauthorized access, alteration, disclosure, or destruction. These safeguards may include encrypted connections, access controls, secure storage practices, monitoring, and periodic security review.",
  },
  {
    title: "Your Privacy Rights",
    body: "Depending on your location, you may have rights to access, correct, delete, restrict, object to processing, or request portability of your personal data. You may contact us to exercise these rights, and we will respond according to applicable law.",
  },
  {
    title: "Data Retention",
    body: "We retain personal information only as long as necessary to provide the service, comply with legal obligations, resolve disputes, enforce agreements, and maintain security. When data is no longer needed, we delete or anonymize it using reasonable methods.",
  },
  {
    title: "Updates to This Policy",
    body: "We may update this Privacy Policy as our services, technology, or legal obligations change. Material updates may be communicated through the website or by direct notice where appropriate.",
  },
  {
    title: "Contact",
    body: "If you have questions about this Privacy Policy or Zuridoc data practices, contact the Zuridoc team through the contact channels provided on our website.",
  },
];

function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827]">
      <header className="bg-[#011B43] px-5 py-5 text-white sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <Link to="/" className="flex h-12 w-[180px] items-center justify-center rounded-xl bg-white px-4 py-2 shadow-lg">
            <img src="/logo to use.png" alt="Zuridoc" className="h-8 w-full object-contain object-center" />
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-10">
          <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-[#0067EC]">Privacy and data transparency</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-normal text-[#011B43] sm:text-5xl">Privacy Policy</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                This policy explains how Zuridoc handles personal information when you visit our website or use our document creation services.
              </p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF4FF] text-[#0067EC]">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </div>

          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-semibold text-[#011B43]">{section.title}</h2>
                <p className="mt-3 leading-7 text-slate-600">{section.body}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}