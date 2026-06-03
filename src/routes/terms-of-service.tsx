import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, FileText } from "lucide-react";

export const Route = createFileRoute("/terms-of-service")({
  component: TermsOfServicePage,
  head: () => ({
    meta: [
      { title: "Terms of Service - Zuridoc" },
      {
        name: "description",
        content: "Read the public Zuridoc Terms of Service and user responsibilities.",
      },
    ],
  }),
});

const sections = [
  {
    title: "Acceptance of Terms",
    body: "By accessing or using Zuridoc, you agree to these Terms of Service and applicable laws. If you use Zuridoc on behalf of an organization, you confirm that you have authority to bind that organization to these terms.",
  },
  {
    title: "User Accounts and Security",
    body: "You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. You should notify us promptly if you suspect unauthorized access, credential compromise, or other security concerns.",
  },
  {
    title: "Use of the Service",
    body: "Zuridoc provides tools for creating, managing, branding, and exporting professional documents. You are responsible for reviewing all generated or edited documents before use and for ensuring that your content complies with applicable laws and professional requirements.",
  },
  {
    title: "Intellectual Property",
    body: "Zuridoc and its platform materials, including software, interface elements, logos, and proprietary content, are owned by Zuridoc or its licensors. You retain ownership of documents, logos, company details, and content you submit, while granting Zuridoc a limited license to process that content as needed to provide the service.",
  },
  {
    title: "Prohibited Activities",
    body: "You may not use Zuridoc to violate laws, infringe rights, distribute malicious code, attempt unauthorized access, scrape or harvest data without permission, bypass security controls, impersonate others, or interfere with platform stability or other users.",
  },
  {
    title: "Third-Party Services",
    body: "Zuridoc may integrate with third-party services for authentication, storage, infrastructure, analytics, or other platform functionality. We are not responsible for third-party websites or services that are not owned or controlled by Zuridoc.",
  },
  {
    title: "Disclaimers and Limitation of Liability",
    body: "The service is provided on an as-is and as-available basis. To the fullest extent permitted by law, Zuridoc is not liable for indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities arising from use of the service.",
  },
  {
    title: "Termination",
    body: "We may suspend or terminate access to Zuridoc if these terms are violated, if account activity creates risk, or where required by law. You may stop using the service at any time, and account data may be handled according to our retention and privacy practices.",
  },
  {
    title: "Changes to Terms",
    body: "We may update these Terms of Service from time to time. Material changes may be communicated through the website or by direct notice where appropriate. Continued use of the service after changes take effect means you accept the updated terms.",
  },
  {
    title: "Contact",
    body: "If you have questions about these Terms of Service, contact the Zuridoc team through the contact channels provided on our website.",
  },
];

function TermsOfServicePage() {
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
              <p className="text-sm font-semibold uppercase text-[#0067EC]">Public legal terms</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-normal text-[#011B43] sm:text-5xl">Terms of Service</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                These terms explain the rules and responsibilities that apply when you access or use Zuridoc.
              </p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF4FF] text-[#0067EC]">
              <FileText className="h-6 w-6" />
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