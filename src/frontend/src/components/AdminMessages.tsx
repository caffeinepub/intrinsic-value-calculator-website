import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Loader2, RefreshCw, ShieldAlert } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { ContactMessage } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { AdminUsers } from "./AdminUsers";

interface AdminMessagesProps {
  onBack: () => void;
}

export function AdminMessages({ onBack }: AdminMessagesProps) {
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const { actor, isFetching: isActorFetching } = useActor();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(false);

  const isLoggedIn = loginStatus === "success" && !!identity;

  const fetchMessages = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const result = await actor.getAllContactMessages();
      const sorted = [...result].sort((a, b) =>
        Number(b.timestamp - a.timestamp),
      );
      setMessages(sorted);
    } catch {
      toast.error("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    if (!isLoggedIn || !actor || isActorFetching) {
      if (!isLoggedIn) {
        setIsAdmin(null);
        setMessages([]);
      }
      return;
    }
    const check = async () => {
      setCheckingAdmin(true);
      try {
        const result = await actor.isCallerAdmin();
        setIsAdmin(result);
        if (result) {
          await fetchMessages();
        }
      } catch {
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    };
    check();
  }, [isLoggedIn, actor, isActorFetching, fetchMessages]);

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
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Initializing */}
        {isInitializing && (
          <div
            className="flex justify-center py-20"
            data-ocid="admin.loading_state"
          >
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Not logged in */}
        {!isLoggedIn && !isInitializing && (
          <Card
            className="max-w-md mx-auto text-center"
            data-ocid="admin.panel"
          >
            <CardHeader>
              <div className="flex justify-center mb-2">
                <ShieldAlert className="h-10 w-10 text-muted-foreground" />
              </div>
              <CardTitle>Admin Login Required</CardTitle>
              <CardDescription>
                Please log in with Internet Identity to access admin messages.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={login}
                disabled={loginStatus === "logging-in"}
                className="w-full"
                data-ocid="admin.primary_button"
              >
                {loginStatus === "logging-in" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {loginStatus === "logging-in" ? "Logging in..." : "Log In"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Checking admin */}
        {isLoggedIn && (checkingAdmin || isActorFetching) && (
          <div
            className="flex justify-center py-20"
            data-ocid="admin.loading_state"
          >
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Not admin */}
        {isLoggedIn &&
          !checkingAdmin &&
          !isActorFetching &&
          isAdmin === false && (
            <Card
              className="max-w-md mx-auto text-center"
              data-ocid="admin.error_state"
            >
              <CardHeader>
                <div className="flex justify-center mb-2">
                  <ShieldAlert className="h-10 w-10 text-destructive" />
                </div>
                <CardTitle>Access Restricted</CardTitle>
                <CardDescription>
                  This area is admin only. Your account does not have admin
                  privileges.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Logged in as:{" "}
                  <span className="font-mono text-xs">
                    {identity?.getPrincipal().toString()}
                  </span>
                </p>
                <Button
                  variant="outline"
                  onClick={() => clear()}
                  data-ocid="admin.secondary_button"
                >
                  Log Out
                </Button>
              </CardContent>
            </Card>
          )}

        {/* Admin view */}
        {isLoggedIn &&
          !checkingAdmin &&
          !isActorFetching &&
          isAdmin === true && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Logged in as admin:{" "}
                  <span className="font-mono text-xs">
                    {identity?.getPrincipal().toString()}
                  </span>
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => clear()}
                  data-ocid="admin.secondary_button"
                >
                  Log Out
                </Button>
              </div>

              <Tabs defaultValue="messages" data-ocid="admin.tab">
                <TabsList className="mb-4">
                  <TabsTrigger value="messages" data-ocid="admin.messages.tab">
                    Contact Messages
                  </TabsTrigger>
                  <TabsTrigger value="users" data-ocid="admin.users.tab">
                    User Profiles
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="messages">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {messages.length} message
                        {messages.length !== 1 ? "s" : ""}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchMessages}
                        disabled={loading}
                        data-ocid="admin.messages.secondary_button"
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <RefreshCw className="h-4 w-4 mr-1" />
                        )}
                        Refresh
                      </Button>
                    </div>

                    {loading ? (
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

                <TabsContent value="users">
                  <AdminUsers />
                </TabsContent>
              </Tabs>
            </div>
          )}
      </main>
    </div>
  );
}
