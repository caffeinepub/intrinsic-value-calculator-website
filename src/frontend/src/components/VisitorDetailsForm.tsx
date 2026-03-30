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
import { Loader2, UserPlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

interface VisitorDetailsFormProps {
  onComplete?: () => void;
}

export function VisitorDetailsForm({ onComplete }: VisitorDetailsFormProps) {
  const { actor, isFetching } = useActor();
  const actorRef = useRef(actor);
  useEffect(() => {
    actorRef.current = actor;
  }, [actor]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const waitForActor = async () => {
    if (actorRef.current) return actorRef.current;
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 500));
      if (actorRef.current) return actorRef.current;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !mobile.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    try {
      const currentActor = await waitForActor();
      if (!currentActor) {
        toast.error("Cannot connect to server. Please refresh and try again.");
        setSubmitting(false);
        return;
      }
      await currentActor.submitVisitorDetails(
        name.trim(),
        email.trim(),
        mobile.trim(),
      );
      toast.success("Details submitted! Welcome to Intri.");
      setName("");
      setEmail("");
      setMobile("");
      onComplete?.();
    } catch (err) {
      console.error("submitVisitorDetails error:", err);
      toast.error(
        "Submission failed. Please check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const isConnecting = isFetching && !actor;

  return (
    <section data-ocid="visitor-form.card">
      <Card className="border-2">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            Register with Intri
          </CardTitle>
          <CardDescription className="text-base">
            Join our community. Enter your details to stay connected.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="visitor-name">Full Name</Label>
              <Input
                id="visitor-name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={submitting}
                data-ocid="visitor-form.input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visitor-email">Email</Label>
              <Input
                id="visitor-email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                data-ocid="visitor-form.input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visitor-mobile">Mobile Number</Label>
              <Input
                id="visitor-mobile"
                type="tel"
                placeholder="Enter your mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                disabled={submitting}
                data-ocid="visitor-form.input"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={submitting}
              data-ocid="visitor-form.submit_button"
            >
              {submitting || isConnecting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {submitting
                ? "Submitting..."
                : isConnecting
                  ? "Connecting..."
                  : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
