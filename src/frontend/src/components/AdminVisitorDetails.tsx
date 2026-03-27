import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { VisitorDetails } from "../backend.d";
import { useActor } from "../hooks/useActor";

export function AdminVisitorDetails() {
  const { actor, isFetching: isActorFetching } = useActor();
  const [visitors, setVisitors] = useState<VisitorDetails[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVisitors = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const result = await actor.getAllVisitorDetails();
      const sorted = [...result].sort((a, b) =>
        Number(b.timestamp - a.timestamp),
      );
      setVisitors(sorted);
    } catch {
      toast.error("Failed to load visitor details.");
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    if (actor && !isActorFetching) {
      fetchVisitors();
    }
  }, [actor, isActorFetching, fetchVisitors]);

  const formatDate = (timestamp: bigint) => {
    const ms = Number(timestamp / BigInt(1_000_000));
    return new Date(ms).toLocaleString();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {visitors.length} visitor{visitors.length !== 1 ? "s" : ""}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchVisitors}
          disabled={loading}
          data-ocid="admin.visitors.secondary_button"
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
                <TableHead className="whitespace-nowrap">Date / Time</TableHead>
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
                  <TableCell className="whitespace-nowrap">{v.email}</TableCell>
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
  );
}
