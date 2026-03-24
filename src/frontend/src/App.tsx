import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import {
  Calculator,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Mail,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { useMemo } from "react";
import { SiGithub, SiLinkedin, SiX } from "react-icons/si";
import { toast } from "sonner";
import { AdminMessages } from "./components/AdminMessages";
import { CalculatorActions } from "./components/CalculatorActions";
import { CompanyInfoDisplay } from "./components/CompanyInfoDisplay";
import { DcfInputsForm } from "./components/DcfInputsForm";
import { ResultsSection } from "./components/ResultsSection";
import { runDevCheck } from "./features/dcf/devChecks";
import {
  DEFAULT_INPUTS,
  EXAMPLE_INPUTS,
  VERIFICATION_INPUTS,
} from "./features/dcf/presets";
import { validateInputs } from "./features/dcf/validation";
import { useQueryInputs } from "./hooks/useQueryInputs";

const INTRI_IDEAS: { name: string; details?: string }[] = [
  {
    name: "Dr. Reddy's",
    details:
      "At the time of article publishing, Dr. Reddy's share was trading at \u20b91,260. Our Intri Model suggests a Buy Price of \u20b91,584 \u2014 which means the share is currently trading at undervalue. The target price is \u20b92,343 (3\u20135 year horizon). As per our knowledge, Pharma sector stocks can brighten your portfolio. Pharma stocks are considered safe and innovation-based, making them a strong long-term bet.",
  },
  { name: "M&M" },
  { name: "NMDC" },
  { name: "Bajaj Finance" },
  { name: "Reliance" },
  { name: "Amara Raja Battery" },
  { name: "CDSL" },
  { name: "Adani Ports" },
  { name: "Eternal" },
  { name: "Adani Power" },
];

const TERMS = [
  {
    title: "No Financial Advice",
    body: "Intri is a financial calculator tool for informational purposes only. Nothing on this platform constitutes financial, investment, legal, or tax advice. Always consult a qualified financial advisor before making any investment decisions.",
  },
  {
    title: "No Liability",
    body: "Intri and its creators are not liable for any losses, damages, or financial outcomes resulting from the use of this tool. All calculations are based on user-supplied data and standard valuation models \u2014 results may not reflect actual market conditions.",
  },
  {
    title: "Data Accuracy",
    body: "The accuracy of results depends entirely on the data entered by the user. Intri does not verify, validate, or source any financial data independently. Users are solely responsible for ensuring their input data is correct and up to date.",
  },
  {
    title: "Usage Terms",
    body: "This tool is intended for personal and educational use only. Commercial redistribution or resale of calculated outputs without permission is prohibited. By using Intri, you agree to these terms.",
  },
  {
    title: "Investment Risk",
    body: "All investments carry risk. Past performance is not indicative of future results. Intrinsic value estimates are theoretical models and do not guarantee any actual price movement or return on investment.",
  },
];

function App() {
  const { inputs, updateInputs, copyShareableLink } = useQueryInputs();
  const errors = useMemo(() => validateInputs(inputs), [inputs]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [expandedIdea, setExpandedIdea] = useState<string | null>(null);

  const handleUseExample = () => {
    updateInputs(EXAMPLE_INPUTS);
  };
  const handleReset = () => {
    updateInputs(DEFAULT_INPUTS);
  };
  const handleRunDevCheck = () => {
    updateInputs(VERIFICATION_INPUTS);
    setTimeout(() => {
      const result = runDevCheck(VERIFICATION_INPUTS);
      if (result.passed) {
        toast.success("Dev Check Passed! \u2705", {
          description: result.message,
          duration: 5000,
        });
      } else {
        toast.error("Dev Check Failed \u274c", {
          description: result.message,
          duration: 5000,
        });
      }
    }, 100);
  };

  if (showAdmin) {
    return (
      <>
        <AdminMessages onBack={() => setShowAdmin(false)} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calculator className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Intri</h1>
              <p className="text-sm text-muted-foreground">
                Track and analyze company financial metrics
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <CalculatorActions
            onUseExample={handleUseExample}
            onReset={handleReset}
            onCopyLink={copyShareableLink}
            onRunDevCheck={handleRunDevCheck}
          />
        </div>

        <div className="max-w-2xl mx-auto space-y-8">
          <CompanyInfoDisplay inputs={inputs} />

          <div>
            <h2 className="text-2xl font-bold mb-4">Company Snapshot</h2>
            {errors.length > 0 && (
              <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm font-medium text-destructive">
                  Please fix the following errors:
                </p>
                <ul className="mt-2 text-sm text-destructive list-disc list-inside">
                  {errors.map((error) => (
                    <li key={error.message}>{error.message}</li>
                  ))}
                </ul>
              </div>
            )}
            <DcfInputsForm
              inputs={inputs}
              onChange={updateInputs}
              errors={errors}
            />
          </div>

          <ResultsSection inputs={inputs} />

          <section data-ocid="intri-ideas.section">
            <Card className="border-2">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Lightbulb className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">
                  Intri Ideas
                </CardTitle>
                <CardDescription className="text-base">
                  Smart recommendations to guide your investment decisions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {INTRI_IDEAS.map((idea, index) => (
                    <li key={idea.name}>
                      <button
                        type="button"
                        onClick={() =>
                          idea.details
                            ? setExpandedIdea(
                                expandedIdea === idea.name ? null : idea.name,
                              )
                            : undefined
                        }
                        className={`w-full flex items-center gap-3 p-3 rounded-lg bg-muted/50 transition-colors text-left ${
                          idea.details
                            ? "hover:bg-muted cursor-pointer"
                            : "cursor-default"
                        }`}
                      >
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="font-medium flex-1">{idea.name}</span>
                        {idea.details &&
                          (expandedIdea === idea.name ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          ))}
                      </button>
                      {idea.details && expandedIdea === idea.name && (
                        <div className="mx-3 mt-1 mb-1 p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm text-muted-foreground leading-relaxed">
                          {idea.details}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          <section data-ocid="contact.section">
            <Card className="border-2">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">Contact Us</CardTitle>
                <CardDescription className="text-base">
                  Have questions or feedback? Reach out to us directly.
                </CardDescription>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <a
                    href="mailto:arpitm204@gmail.com"
                    className="text-primary hover:underline font-medium"
                  >
                    arpitm204@gmail.com
                  </a>
                </div>
              </CardHeader>
            </Card>
          </section>

          <section data-ocid="terms.section">
            <Card className="border-2">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">
                  Terms and Conditions
                </CardTitle>
                <CardDescription className="text-base">
                  Please read these terms carefully before using Intri.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {TERMS.map((term, index) => (
                    <li
                      key={term.title}
                      className="p-4 rounded-lg bg-muted/50 border border-border/50"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-sm mb-1">
                            {term.title}
                          </p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {term.body}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-muted-foreground text-center">
                  By using Intri, you acknowledge that you have read and agree
                  to these terms.
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Built with \u2764\ufe0f using{" "}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setShowAdmin(true)}
                className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                data-ocid="admin.link"
              >
                Admin
              </button>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <SiX className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <SiLinkedin className="h-5 w-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <SiGithub className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}

export default App;
