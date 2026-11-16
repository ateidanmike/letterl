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
    <div className="landing nb-dots min-h-screen bg-[#FFF7E3] text-[#011B43]">
      <header className="border-b-[3px] border-[#011B43] bg-[#FFF7E3] px-5 sm:px-8">
        <div className="mx-auto flex h-[68px] max-w-5xl items-center justify-between gap-4">
          <Link to="/" className="nb-focus flex items-center">
            <img src="/logo to use.png" alt="Zuridoc" className="h-14 w-auto object-contain" />
          </Link>
          <Link
            to="/"
            className="nb-focus inline-flex items-center gap-2 text-[15px] font-extrabold underline decoration-[3px] underline-offset-4 hover:decoration-[#FF7AA2]"
          >
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="nb-box-lg bg-white p-6 sm:p-10">
          <div className="mb-8 flex flex-col gap-4 border-b-[3px] border-[#011B43] pb-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="nb-scribble inline-block -rotate-2 border-[3px] border-[#011B43] bg-[#FFD43B] px-4 py-1 text-sm font-extrabold uppercase tracking-[0.12em]">
                Privacy and data transparency
              </p>
              <h1 className="mt-5 text-5xl font-extrabold leading-none tracking-[-0.03em] sm:text-6xl">
                Privacy Policy
              </h1>
              <p className="mt-4 max-w-3xl text-lg font-medium leading-8">
                This policy explains how Zuridoc handles personal information when you visit our
                website or use our document creation services.
              </p>
            </div>
            <div className="flex h-14 w-14 shrink-0 rotate-6 items-center justify-center border-[3px] border-[#011B43] bg-[#6EE7B7] shadow-[4px_4px_0_0_#011B43]">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </div>

          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-2xl font-extrabold tracking-tight">{section.title}</h2>
                <p className="mt-3 text-[17px] font-medium leading-8">{section.body}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
