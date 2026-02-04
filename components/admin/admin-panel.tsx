"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  ShieldAlert, 
  Loader2, 
  UserPlus, 
  Trash2, 
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";

export function AdminPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await authClient.admin.listUsers({
        query: { limit: 100 }
      });
      if (data) setUsers(data.users);
    } catch (error) {
      toast.error("Gagal mengambil data user");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await authClient.admin.setRole({
        userId,
        role: newRole
      });
      toast.success(`Role diperbarui menjadi ${newRole}`);
      fetchUsers();
    } catch (error) {
      toast.error("Gagal memperbarui role");
    }
  };

  return (
    <div className="space-y-8">
      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <ShieldAlert className="w-5 h-5" />
            Superadmin Access Only
          </CardTitle>
          <CardDescription>Kelola akun admin dan hak akses sistem.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button variant="outline" size="sm" onClick={fetchUsers}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>

          {loading ? (
            <div className="py-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto opacity-20" /></div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Tindakan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-sm">{user.email}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.role === "superadmin" ? "default" : "secondary"}
                          className="capitalize"
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {user.role === "user" ? (
                          <Button size="sm" onClick={() => handleUpdateRole(user.id, "admin")}>
                            Jadikan Admin
                          </Button>
                        ) : user.role === "admin" ? (
                          <Button variant="outline" size="sm" onClick={() => handleUpdateRole(user.id, "user")}>
                            Turunkan ke User
                          </Button>
                        ) : null}
                        
                        {user.role === "admin" && (
                          <Button variant="destructive" size="sm" onClick={() => handleUpdateRole(user.id, "superadmin")}>
                            Jadikan Superadmin
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="p-6 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h3 className="font-bold">Keamanan Sistem</h3>
            <p className="text-sm text-slate-400">Anti-DDoS dan Filter XSS aktif di seluruh API route.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
