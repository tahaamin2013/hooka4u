"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, Eye, EyeOff, X, UserPlus } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

interface User {
  id: string;
  username: string;
  name?: string;
  role: "USER" | "ADMIN";
  createdAt: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");
  const [showPassword, setShowPassword] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch users from database
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users");

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to load users", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!username.trim()) {
      toast.info("Username is required", {
        description: "Please enter a username.",
      });
      return;
    }

    if (!password.trim()) {
      toast.info("Password is required", {
        description: "Please enter a password.",
      });
      return;
    }

    if (password.length < 6) {
      toast.info("Password too short", {
        description: "Password must be at least 6 characters long.",
      });
      return;
    }

    try {
      setSubmitting(true);
      const userData = {
        username: username.trim(),
        password: password,
        name: name.trim() || undefined,
        role,
      };

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create user");
      }

      const newUser = await response.json();

      // Reset form
      setUsername("");
      setPassword("");
      setName("");
      setRole("USER");
      setIsFormOpen(false);

      // Refresh user list
      await fetchUsers();

      toast.success("User created successfully!", {
        description: `Username: ${newUser.username}`,
      });
    } catch (err) {
      console.error("Error creating user:", err);
      toast.error("Failed to create user", {
        description: err instanceof Error ? err.message : "Please try again later",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (!confirm(`Are you sure you want to delete user "${username}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      await fetchUsers();

      toast.success("User deleted successfully", {
        description: `User "${username}" has been removed.`,
      });
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Failed to delete user", {
        description: "Please try again later",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex h-14 shrink-0 items-center gap-3 bg-card border-b border-border">
        <div className="flex items-center gap-3 px-3 sm:px-5 w-full">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink
                  href="#"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Admin
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-foreground text-sm font-medium">
                  User Management
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Users List Section */}
        <div className="flex-1 flex flex-col overflow-hidden pb-20 md:pb-0 bg-zinc-50 md:bg-background">
          <div className="flex-1 overflow-y-auto p-3 sm:p-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Users</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage system users and their roles
                  </p>
                </div>
                <Button
                  onClick={() => setIsFormOpen(true)}
                  className="hidden gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add User
                </Button>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground text-sm">Loading users...</p>
                </div>
              ) : users.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <UserPlus className="w-12 h-12 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground text-sm">No users yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Add your first user to get started
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3 sm:gap-4">
                  {users.map((user) => (
                    <Card key={user.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-base text-foreground truncate">
                                {user.username}
                              </h3>
                              <Badge
                                variant={user.role === "ADMIN" ? "default" : "secondary"}
                                className="shrink-0"
                              >
                                {user.role}
                              </Badge>
                            </div>
                            {user.name && (
                              <p className="text-sm text-muted-foreground mb-1">
                                {user.name}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              Created: {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDeleteUser(user.id, user.username)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Add User Button */}
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-border p-4 shadow-lg">
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-semibold rounded-lg"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New User
          </Button>
        </div>

        {/* Desktop Form Sidebar */}
        <div className="hidden md:block w-96 border-l border-border bg-card overflow-y-auto">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Add New User</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Create a new system user
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={submitting}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Minimum 6 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter full name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label>Role *</Label>
                <RadioGroup value={role} onValueChange={(v) => setRole(v as "USER" | "ADMIN")}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="USER" id="user" />
                    <Label htmlFor="user" className="font-normal cursor-pointer">
                      User - Standard access
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ADMIN" id="admin" />
                    <Label htmlFor="admin" className="font-normal cursor-pointer">
                      Admin - Full access
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                onClick={handleAddUser}
                disabled={submitting}
                className="w-full"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create User
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Form Sheet */}
        {isFormOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsFormOpen(false)}
            />
            <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-zinc-950 text-white shadow-2xl z-50 md:hidden transition-transform duration-300 ease-out flex flex-col">
              {/* Sheet Header */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-lime-500" />
                  Add New User
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-zinc-800 text-white"
                  onClick={() => setIsFormOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Sheet Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobile-username" className="text-zinc-200">Username *</Label>
                    <Input
                      id="mobile-username"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={submitting}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile-password" className="text-zinc-200">Password *</Label>
                    <div className="relative">
                      <Input
                        id="mobile-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={submitting}
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-zinc-700 text-zinc-400"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Minimum 6 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile-name" className="text-zinc-200">Full Name</Label>
                    <Input
                      id="mobile-name"
                      placeholder="Enter full name (optional)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={submitting}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-200">Role *</Label>
                    <RadioGroup value={role} onValueChange={(v) => setRole(v as "USER" | "ADMIN")}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="USER" id="mobile-user" />
                        <Label htmlFor="mobile-user" className="font-normal cursor-pointer text-zinc-300">
                          User - Standard access
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ADMIN" id="mobile-admin" />
                        <Label htmlFor="mobile-admin" className="font-normal cursor-pointer text-zinc-300">
                          Admin - Full access
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* Sheet Footer */}
              <div className="p-4 border-t border-zinc-800 bg-zinc-900">
                <Button
                  onClick={handleAddUser}
                  disabled={submitting}
                  className="w-full bg-lime-500 hover:bg-lime-600 text-black h-12"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create User
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}