import { useMemo } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { DcfInputsForm } from './components/DcfInputsForm';
import { CalculatorActions } from './components/CalculatorActions';
import { ResultsSection } from './components/ResultsSection';
import { useQueryInputs } from './hooks/useQueryInputs';
import { validateInputs } from './features/dcf/validation';
import { DEFAULT_INPUTS, EXAMPLE_INPUTS } from './features/dcf/presets';
import { Calculator } from 'lucide-react';
import { SiX, SiLinkedin, SiGithub } from 'react-icons/si';

function App() {
  const { inputs, updateInputs, copyShareableLink } = useQueryInputs();
  const errors = useMemo(() => validateInputs(inputs), [inputs]);

  const handleUseExample = () => {
    updateInputs(EXAMPLE_INPUTS);
  };

  const handleReset = () => {
    updateInputs(DEFAULT_INPUTS);
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
              <h1 className="text-2xl font-bold">Company Snapshot Tool</h1>
              <p className="text-sm text-muted-foreground">
                Track and analyze company financial metrics
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-card to-background">
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold leading-tight">
                Organize Company Information
              </h2>
              <p className="text-lg text-muted-foreground">
                Keep track of key financial metrics, market data, and company fundamentals in one place.
                Share snapshots with colleagues using shareable links.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Financial metrics</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Market data</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Shareable links</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/ivc-hero.dim_1600x900.png"
                alt="Company Snapshot Tool Illustration"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Actions */}
        <div className="mb-6">
          <CalculatorActions
            onUseExample={handleUseExample}
            onReset={handleReset}
            onCopyLink={copyShareableLink}
          />
        </div>

        {/* Single column layout */}
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Company Information</h2>
            {errors.length > 0 && (
              <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm font-medium text-destructive">
                  Please fix the following errors:
                </p>
                <ul className="mt-2 text-sm text-destructive list-disc list-inside">
                  {errors.map((error, i) => (
                    <li key={i}>{error.message}</li>
                  ))}
                </ul>
              </div>
            )}
            <DcfInputsForm inputs={inputs} onChange={updateInputs} errors={errors} />
          </div>

          {/* Results Section */}
          <ResultsSection inputs={inputs} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  window.location.hostname
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
