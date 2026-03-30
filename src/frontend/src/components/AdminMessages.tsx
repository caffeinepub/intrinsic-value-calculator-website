import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, KeyRound, Loader2, LogOut, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ContactMessage, VisitorDetails } from "../backend.d";
import { useActor } from "../hooks/useActor";

const ADMIN_PIN = "INTRI2024";

interface AdminMessagesProps {
  onBack: () => void;
}

export function AdminMessages({ onBack }: AdminMessagesProps) {
  const { actor } = useActor();
  const [pin, setPin] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logging, setLogging] = useState(false);
  const [visitors, setVisitors] = useState<VisitorDetails[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingVisitors, setLoadingVisitors] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const handleLogin = async () => {
    // Verify PIN on the frontend first
    if (pin !== ADMIN_PIN) {
      toast.error("Incorrect PIN. Please try again.");
      return;
    }

    if (!actor) {
      toast.error(
        "Still connecting to backend. Please wait a moment and try again.",
      );
      return;
    }

    setLogging(true);
    try {
      const [visitorsResult, messagesResult] = await Promise.all([
        (actor as any).getAllVisitorDetailsWithPin(ADMIN_PIN) as Promise<
          VisitorDetails[]
        >,
        (actor as any).getAllContactMessagesWithPin(ADMIN_PIN) as Promise<
          ContactMessage[]
        >,
      ]);
      const sortedVisitors = [...visitorsResult].sort((a, b) =>
        Number(b.timestamp - a.timestamp),
      );
      const sortedMessages = [...messagesResult].sort((a, b) =>
        Number(b.timestamp - a.timestamp),
      );
      setVisitors(sortedVisitors);
      setMessages(sortedMessages);
      setIsLoggedIn(true);
    } catch (err) {
      const msg = (err as any)?.message || String(err);
      console.error("Admin login error:", msg);
      if (msg.includes("Invalid admin PIN")) {
        toast.error("Incorrect PIN. Please try again.");
      } else {
        toast.error("Failed to load data. Please try again in a moment.");
      }
    } finally {
      setLogging(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPin("");
    setVisitors([]);
    setMessages([]);
  };

  const refreshVisitors = async () => {
    if (!actor) return;
    setLoadingVisitors(true);
    try {
      const rawActor = actor as any;
      const result = (await rawActor.getAllVisitorDetailsWithPin(
        ADMIN_PIN,
      )) as VisitorDetails[];
      const sorted = [...result].sort((a, b) =>
        Number(b.timestamp - a.timestamp),
      );
      setVisitors(sorted);
    } catch {
      toast.error("Failed to refresh visitor data.");
    } finally {
      setLoadingVisitors(false);
    }
  };

  const refreshMessages = async () => {
    if (!actor) return;
    setLoadingMessages(true);
    try {
      const rawActor = actor as any;
      const result = (await rawActor.getAllContactMessagesWithPin(
        ADMIN_PIN,
      )) as ContactMessage[];
      const sorted = [...result].sort((a, b) =>
        Number(b.timestamp - a.timestamp),
      );
      setMessages(sorted);
    } catch {
      toast.error("Failed to refresh messages.");
    } finally {
      setLoadingMessages(false);
    }
  };

  const formatDate = (timestamp: bigint) => {
    const ms = Number(timestamp / BigInt(1_000_000));
    return new Date(ms).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              data-ocid="admin.back_button"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="text-xl font-bold">Admin Panel</h1>
            {isLoggedIn && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="ml-auto"
                data-ocid="admin.secondary_button"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Log Out
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {!isLoggedIn && (
          <Card className="max-w-md mx-auto" data-ocid="admin.panel">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <KeyRound className="h-10 w-10 text-muted-foreground" />
              </div>
              <CardTitle>Admin Access</CardTitle>
              <CardDescription>
                Enter the admin PIN to view registration data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="password"
                placeholder="Enter admin PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                autoComplete="current-password"
                inputMode="text"
                data-ocid="admin.input"
              />
              <Button
                onClick={handleLogin}
                disabled={logging || !pin}
                className="w-full"
                data-ocid="admin.primary_button"
              >
                {logging ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {logging ? "Verifying..." : "Access Admin Panel"}
              </Button>
            </CardContent>
          </Card>
        )}

        {isLoggedIn && (
          <Tabs defaultValue="visitors" data-ocid="admin.tab">
            <TabsList className="mb-4">
              <TabsTrigger value="visitors" data-ocid="admin.visitors.tab">
                Visitor Details
              </TabsTrigger>
              <TabsTrigger value="messages" data-ocid="admin.messages.tab">
                Contact Messages
              </TabsTrigger>
            </TabsList>

            <TabsContent value="visitors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {visitors.length} visitor{visitors.length !== 1 ? "s" : ""}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshVisitors}
                    disabled={loadingVisitors}
                    data-ocid="admin.visitors.secondary_button"
                  >
                    {loadingVisitors ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-1" />
                    )}
                    Refresh
                  </Button>
                </div>

                {loadingVisitors ? (
                  <div
                    className="flex justify-center py-16"
                    data-ocid="admin.visitors.loading_state"
                  >
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : visitors.length === 0 ? (
                  <Card data-ocid="admin.visitors.empty_state">
                    <CardContent className="py-16 text-center text-muted-foreground">
                      No visitor registrations yet.
                    </CardContent>
                  </Card>
                ) : (
                  <Card data-ocid="admin.visitors.table">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Full Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Mobile</TableHead>
                          <TableHead className="whitespace-nowrap">
                            Date / Time
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {visitors.map((v, i) => (
                          <TableRow
                            key={String(v.id)}
                            data-ocid={`admin.visitors.item.${i + 1}`}
                          >
                            <TableCell className="font-medium whitespace-nowrap">
                              {v.name}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {v.email}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {v.mobile}
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                              {formatDate(v.timestamp)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="messages">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {messages.length} message{messages.length !== 1 ? "s" : ""}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshMessages}
                    disabled={loadingMessages}
                    data-ocid="admin.messages.secondary_button"
                  >
                    {loadingMessages ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-1" />
                    )}
                    Refresh
                  </Button>
                </div>

                {loadingMessages ? (
                  <div
                    className="flex justify-center py-16"
                    data-ocid="admin.messages.loading_state"
                  >
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : messages.length === 0 ? (
                  <Card data-ocid="admin.messages.empty_state">
                    <CardContent className="py-16 text-center text-muted-foreground">
                      No messages yet.
                    </CardContent>
                  </Card>
                ) : (
                  <Card data-ocid="admin.messages.table">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead className="whitespace-nowrap">
                            Date / Time
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {messages.map((msg, i) => (
                          <TableRow
                            key={String(msg.id)}
                            data-ocid={`admin.messages.item.${i + 1}`}
                          >
                            <TableCell className="font-medium whitespace-nowrap">
                              {msg.name}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {msg.email}
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <p className="whitespace-pre-wrap break-words">
                                {msg.message}
                              </p>
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                              {formatDate(msg.timestamp)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
