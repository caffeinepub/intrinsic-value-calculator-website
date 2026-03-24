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
import type { Principal } from "@icp-sdk/core/principal";
import { Loader2, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { UserProfile } from "../backend.d";
import { useActor } from "../hooks/useActor";

export function AdminUsers() {
  const { actor, isFetching } = useActor();
  const [users, setUsers] = useState<Array<[Principal, UserProfile]>>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const result = await actor.getAllUserProfiles();
      setUsers(result);
    } catch {
      toast.error("Failed to load user profiles.");
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    if (actor && !isFetching) {
      fetchUsers();
    }
  }, [actor, isFetching, fetchUsers]);

  if (loading || isFetching) {
    return (
      <div
        className="flex justify-center py-16"
        data-ocid="admin.users.loading_state"
      >
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {users.length} registered user{users.length !== 1 ? "s" : ""}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchUsers}
          disabled={loading}
          data-ocid="admin.users.secondary_button"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-1" />
          )}
          Refresh
        </Button>
      </div>

      {users.length === 0 ? (
        <Card data-ocid="admin.users.empty_state">
          <CardContent className="py-16 text-center text-muted-foreground">
            No registered users yet.
          </CardContent>
        </Card>
      ) : (
        <Card data-ocid="admin.users.table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Mobile Number</TableHead>
                <TableHead>Principal ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(([principal, profile], i) => (
                <TableRow
                  key={principal.toString()}
                  data-ocid={`admin.users.item.${i + 1}`}
                >
                  <TableCell className="font-medium">
                    {profile.firstName}
                  </TableCell>
                  <TableCell>{profile.lastName}</TableCell>
                  <TableCell>{profile.mobileNumber}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground max-w-[180px] truncate">
                    {principal.toString()}
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
