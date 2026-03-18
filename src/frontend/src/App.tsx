import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { Calculator, Mail, MessageSquare, User } from "lucide-react";
import { useMemo, useState } from "react";
import { SiGithub, SiLinkedin, SiX } from "react-icons/si";
import { toast } from "sonner";
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

function App() {
  const { inputs, updateInputs, copyShareableLink } = useQueryInputs();
  const errors = useMemo(() => validateInputs(inputs), [inputs]);

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);

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
        toast.success("Dev Check Passed! ✅", {
          description: result.message,
          duration: 5000,
        });
      } else {
        toast.error("Dev Check Failed ❌", {
          description: result.message,
          duration: 5000,
        });
      }
    }, 100);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !contactForm.name.trim() ||
      !contactForm.email.trim() ||
      !contactForm.message.trim()
    ) {
      toast.error("Please fill in all fields.");
      return;
    }
    setContactSubmitting(true);
    setTimeout(() => {
      setContactSubmitting(false);
      setContactForm({ name: "", email: "", message: "" });
      toast.success("Message sent! We'll get back to you soon. 🙏");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Actions */}
        <div className="mb-6">
          <CalculatorActions
            onUseExample={handleUseExample}
            onReset={handleReset}
            onCopyLink={copyShareableLink}
            onRunDevCheck={handleRunDevCheck}
          />
        </div>

        {/* Single column layout */}
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Company Info Display */}
          <CompanyInfoDisplay inputs={inputs} />

          {/* Input Form */}
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

          {/* Results Section */}
          <ResultsSection inputs={inputs} />

          {/* Contact Us Section */}
          <section data-ocid="contact.section">
            <Card className="border-2">
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">Contact Us</CardTitle>
                <CardDescription className="text-base">
                  Have questions or feedback? We'd love to hear from you.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <form
                  onSubmit={handleContactSubmit}
                  className="space-y-5"
                  data-ocid="contact.dialog"
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="contact-name"
                      className="flex items-center gap-2"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      Name
                    </Label>
                    <Input
                      id="contact-name"
                      data-ocid="contact.input"
                      placeholder="Your full name"
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="contact-email"
                      className="flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      Email
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      data-ocid="contact.input"
                      placeholder="your@email.com"
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="contact-message"
                      className="flex items-center gap-2"
                    >
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      Message
                    </Label>
                    <Textarea
                      id="contact-message"
                      data-ocid="contact.textarea"
                      placeholder="Write your message here..."
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={contactSubmitting}
                    data-ocid="contact.submit_button"
                  >
                    {contactSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  window.location.hostname,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </div>
            <div className="flex gap-4">
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
