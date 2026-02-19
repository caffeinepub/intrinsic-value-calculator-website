import { useMemo } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { DcfInputsForm } from './components/DcfInputsForm';
import { CalculatorActions } from './components/CalculatorActions';
import { ResultsSection } from './components/ResultsSection';
import { CompanyInfoDisplay } from './components/CompanyInfoDisplay';
import { useQueryInputs } from './hooks/useQueryInputs';
import { validateInputs } from './features/dcf/validation';
import { DEFAULT_INPUTS, EXAMPLE_INPUTS, VERIFICATION_INPUTS } from './features/dcf/presets';
import { runDevCheck } from './features/dcf/devChecks';
import { Calculator } from 'lucide-react';
import { SiX, SiLinkedin, SiGithub } from 'react-icons/si';
import { toast } from 'sonner';

function App() {
  const { inputs, updateInputs, copyShareableLink } = useQueryInputs();
  const errors = useMemo(() => validateInputs(inputs), [inputs]);

  const handleUseExample = () => {
    updateInputs(EXAMPLE_INPUTS);
  };

  const handleReset = () => {
    updateInputs(DEFAULT_INPUTS);
  };

  const handleRunDevCheck = () => {
    // Load verification inputs
    updateInputs(VERIFICATION_INPUTS);
    
    // Run the check after a brief delay to allow state to update
    setTimeout(() => {
      const result = runDevCheck(VERIFICATION_INPUTS);
      
      if (result.passed) {
        toast.success('Dev Check Passed! ✅', {
          description: result.message,
          duration: 5000,
        });
      } else {
        toast.error('Dev Check Failed ❌', {
          description: result.message,
          duration: 5000,
        });
      }
    }, 100);
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
