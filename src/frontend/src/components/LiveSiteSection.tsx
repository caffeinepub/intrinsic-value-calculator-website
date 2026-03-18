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
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { isValidHttpUrl, safeCopyToClipboard, safeOpenUrl } from "@/lib/url";
import { AlertCircle, CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DRAFT_URL = "https://familiar-chocolate-i32-draft.caffeine.xyz/";
const CAFFEINE_DASHBOARD_URL = "https://caffeine.ai/dashboard";

export function LiveSiteSection() {
  const [liveUrl, setLiveUrl] = useLocalStorage<string>("intri-live-url", "");
  const [inputValue, setInputValue] = useState(liveUrl);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [copiedLive, setCopiedLive] = useState(false);

  const handleCopyDraft = async () => {
    try {
      await safeCopyToClipboard(DRAFT_URL);
      setCopiedDraft(true);
      toast.success("Draft URL copied to clipboard!");
      setTimeout(() => setCopiedDraft(false), 2000);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to copy URL";
      toast.error(message, {
        duration: 5000,
        icon: <AlertCircle className="h-4 w-4" />,
      });
    }
  };

  const handleCopyLive = async () => {
    try {
      await safeCopyToClipboard(liveUrl);
      setCopiedLive(true);
      toast.success("Live URL copied to clipboard!");
      setTimeout(() => setCopiedLive(false), 2000);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to copy URL";
      toast.error(message, {
        duration: 5000,
        icon: <AlertCircle className="h-4 w-4" />,
      });
    }
  };

  const handleOpenLive = () => {
    try {
      safeOpenUrl(liveUrl);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to open URL";
      toast.error(message, {
        duration: 5000,
        icon: <AlertCircle className="h-4 w-4" />,
      });
    }
  };

  const handleOpenDashboard = () => {
    try {
      window.open(CAFFEINE_DASHBOARD_URL, "_blank", "noopener,noreferrer");
    } catch (_error) {
      toast.error("Failed to open Caffeine dashboard", {
        duration: 5000,
        icon: <AlertCircle className="h-4 w-4" />,
      });
    }
  };

  const handleSaveLiveUrl = () => {
    const trimmedUrl = inputValue.trim();

    if (!trimmedUrl) {
      toast.error("Please enter a URL", {
        icon: <AlertCircle className="h-4 w-4" />,
      });
      return;
    }

    if (!isValidHttpUrl(trimmedUrl)) {
      toast.error("Please enter a valid http:// or https:// URL", {
        duration: 5000,
        icon: <AlertCircle className="h-4 w-4" />,
      });
      return;
    }

    setLiveUrl(trimmedUrl);
    toast.success("Live URL saved!");
  };

  const handleClearLiveUrl = () => {
    setLiveUrl("");
    setInputValue("");
    toast.success("Live URL cleared");
  };

  return (
    <Card className="border-primary/20 bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5 text-primary" />
          Publish / Live URL
        </CardTitle>
        <CardDescription>
          Publishing to Live mode must be done through the Caffeine platform
          dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Draft URL Section */}
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-sm mb-1">
              Draft URL (Shareable Now)
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Your draft is already live and can be shared with anyone. However,
              this is <strong>not your final public website</strong>.
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              value={DRAFT_URL}
              readOnly
              className="font-mono text-sm bg-muted"
            />
            <Button
              type="button"
              onClick={handleCopyDraft}
              variant="outline"
              size="icon"
              className="shrink-0"
              aria-label="Copy draft URL"
            >
              {copiedDraft ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Publishing Instructions */}
        <div className="space-y-3 pt-4 border-t">
          <h3 className="font-semibold text-sm">How to Publish to Live Mode</h3>
          <p className="text-sm text-muted-foreground mb-2">
            This app cannot publish to Live by itself. Publishing is done
            through the <strong>Caffeine platform dashboard</strong>:
          </p>
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside ml-2">
            <li>
              Open your project dashboard in the Caffeine platform (use the
              button below).
            </li>
            <li>
              Find the <strong>"Push to Live"</strong> or{" "}
              <strong>"Publish"</strong> button (usually near the top of the
              page).
            </li>
            <li>
              Click the button to deploy your draft to the live/public
              environment.
            </li>
            <li>
              Once published, copy your <strong>live URL</strong> from the
              platform and paste it below to save it for easy access.
            </li>
          </ol>

          {/* CTA Button to Open Dashboard */}
          <div className="pt-2">
            <Button
              type="button"
              onClick={handleOpenDashboard}
              variant="default"
              className="w-full"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Caffeine Dashboard
            </Button>
          </div>

          {/* Troubleshooting Section */}
          <div className="bg-muted/50 border border-border rounded-md p-3 mt-3">
            <p className="text-xs text-muted-foreground">
              <strong>Troubleshooting:</strong> If you cannot see or access the
              publish button in the dashboard:
            </p>
            <ul className="text-xs text-muted-foreground mt-2 space-y-1 list-disc list-inside ml-2">
              <li>Try refreshing or reopening the Caffeine dashboard</li>
              <li>
                Confirm you are logged into the correct account and viewing the
                correct project
              </li>
              <li>
                Check that you have the necessary permissions/role to publish
              </li>
              <li>
                If issues persist, contact Caffeine support for assistance
              </li>
            </ul>
          </div>
        </div>

        {/* Live URL Section */}
        <div className="space-y-3 pt-4 border-t">
          <div>
            <h3 className="font-semibold text-sm mb-1">
              Live URL (After Publishing)
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              After you publish to Live mode in the Caffeine platform, paste
              your live/public URL here to save it locally.
            </p>
          </div>

          {liveUrl ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={liveUrl}
                  readOnly
                  className="font-mono text-sm bg-muted"
                />
                <Button
                  type="button"
                  onClick={handleCopyLive}
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  aria-label="Copy live URL"
                >
                  {copiedLive ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={handleOpenLive}
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  aria-label="Open live URL in new tab"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              <Button
                type="button"
                onClick={handleClearLiveUrl}
                variant="ghost"
                size="sm"
                className="w-full"
              >
                Clear Live URL
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <Label htmlFor="live-url-input" className="text-sm">
                  Enter your live URL
                </Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="live-url-input"
                    type="url"
                    placeholder="https://your-live-site.com"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSaveLiveUrl();
                      }
                    }}
                    className="font-mono text-sm"
                  />
                  <Button
                    type="button"
                    onClick={handleSaveLiveUrl}
                    variant="default"
                    className="shrink-0"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
