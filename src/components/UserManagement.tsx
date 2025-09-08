import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  MoreHorizontal,
  Shield,
  Activity,
  Clock,
  Mail,
  Key,
  Edit,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock user data
const mockUsers = [
  {
    id: '1',
    email: 'admin@company.com',
    full_name: 'John Admin',
    role: 'admin' as const,
    created_at: '2024-01-15T10:00:00Z',
    last_login: '2024-03-01T09:30:00Z',
    status: 'active',
    devices_managed: 45
  },
  {
    id: '2',
    email: 'security@company.com',
    full_name: 'Sarah Security',
    role: 'security_analyst' as const,
    created_at: '2024-02-01T14:00:00Z',
    last_login: '2024-03-01T08:15:00Z',
    status: 'active',
    devices_managed: 0
  },
  {
    id: '3',
    email: 'deviceowner@company.com',
    full_name: 'Mike Owner',
    role: 'device_owner' as const,
    created_at: '2024-02-15T16:30:00Z',
    last_login: '2024-02-28T17:45:00Z',
    status: 'active',
    devices_managed: 12
  },
  {
    id: '4',
    email: 'analyst@company.com',
    full_name: 'Emma Analyst',
    role: 'security_analyst' as const,
    created_at: '2024-03-01T11:00:00Z',
    last_login: null,
    status: 'pending',
    devices_managed: 0
  }
];

const UserManagement = () => {
  const [users] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: 'bg-destructive text-destructive-foreground',
      security_analyst: 'bg-warning text-warning-foreground',
      device_owner: 'bg-primary text-primary-foreground'
    };

    const displayRole = role.replace('_', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    return (
      <Badge className={variants[role as keyof typeof variants] || 'bg-muted text-muted-foreground'}>
        {displayRole}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-success text-success-foreground',
      pending: 'bg-warning text-warning-foreground',
      inactive: 'bg-muted text-muted-foreground'
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-muted text-muted-foreground'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const userCounts = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    pending: users.filter(u => u.status === 'pending').length,
    admins: users.filter(u => u.role === 'admin').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">User Management</h2>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="glass">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user to the security platform.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input id="full_name" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@company.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="security_analyst">Security Analyst</SelectItem>
                    <SelectItem value="device_owner">Device Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="bg-gradient-primary">Create User</Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{userCounts.total}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-success">{userCounts.active}</p>
              </div>
              <Activity className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning">{userCounts.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold text-destructive">{userCounts.admins}</p>
              </div>
              <Shield className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="glass shadow-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="security_analyst">Security Analyst</SelectItem>
                <SelectItem value="device_owner">Device Owner</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="glass shadow-card">
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Devices</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-foreground">
                          {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{user.full_name || 'No name'}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-muted-foreground" />
                      {user.devices_managed}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass">
                        <DialogHeader>
                          <DialogTitle>User Details: {selectedUser?.full_name || selectedUser?.email}</DialogTitle>
                          <DialogDescription>
                            Manage user permissions and account settings.
                          </DialogDescription>
                        </DialogHeader>
                        {selectedUser && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Full Name</label>
                                <p className="text-sm text-muted-foreground">{selectedUser.full_name || 'Not provided'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Email</label>
                                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Role</label>
                                <div className="mt-1">{getRoleBadge(selectedUser.role)}</div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Status</label>
                                <div className="mt-1">{getStatusBadge(selectedUser.status)}</div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Devices Managed</label>
                                <p className="text-sm text-muted-foreground">{selectedUser.devices_managed}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Created</label>
                                <p className="text-sm text-muted-foreground">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex gap-2 pt-4">
                              <Button size="sm" className="bg-gradient-primary">
                                <Edit className="w-3 h-3 mr-1" />
                                Edit User
                              </Button>
                              <Button size="sm" variant="outline">
                                <Key className="w-3 h-3 mr-1" />
                                Reset Password
                              </Button>
                              <Button size="sm" variant="outline" className="text-destructive border-destructive">
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredUsers.length === 0 && (
        <Card className="glass shadow-card">
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No users found</h3>
            <p className="text-muted-foreground">
              No users match your current search criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserManagement;