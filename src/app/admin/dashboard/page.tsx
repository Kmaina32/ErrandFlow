import { createSupabaseClient } from '@/lib/supabase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { Badge } from '@/components/ui/badge';
import { Package, CheckCircle, Clock } from 'lucide-react';

type ErrandRequest = {
  id: string;
  dispatcherName: string;
  dispatcherPhone: string;
  taskType: string;
  pickupLocation: string;
  dropoffLocation: string;
  status: 'pending' | 'in-progress' | 'completed';
  created_at: string;
};

async function getErrandRequests(): Promise<ErrandRequest[]> {
  // Create the Supabase client *inside* the function
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
        // Check for permission errors, which often point to RLS issues.
        if (error.code === '42501') { // permission_denied in Postgres
             console.error('Supabase permission error:', error);
             throw new Error(
                'Permission denied. Please check your Supabase Row Level Security (RLS) policies for the "requests" table.'
            );
        }
      console.error('Error fetching errand requests from Supabase:', error);
      throw new Error(`Failed to fetch data from Supabase. ${error.message}`);
    }

    if (!data) {
      return [];
    }

    return data.map((d: any) => ({
      id: d.id,
      dispatcherName: d.dispatcherName,
      dispatcherPhone: d.dispatcherPhone,
      taskType: d.taskType,
      pickupLocation: d.pickupLocation,
      dropoffLocation: d.dropoffLocation,
      status: d.status || 'pending',
      created_at: d.created_at,
    }));

  } catch (error) {
     console.error('Error in getErrandRequests:', error);
     // Re-throw the error to be caught by Next.js error boundary
     if (error instanceof Error) {
        throw error;
     }
     throw new Error('An unknown error occurred while fetching errand requests.');
  }
}

export default async function DashboardPage() {
  let requests: ErrandRequest[] = [];
  let fetchError: Error | null = null;
  try {
      requests = await getErrandRequests();
  } catch (error) {
      if (error instanceof Error) {
        fetchError = error;
      } else {
        fetchError = new Error('An unknown error occurred.');
      }
  }


  const totalRequests = requests.length;
  const pendingRequests = requests.filter(req => req.status === 'pending').length;
  const completedRequests = requests.filter(req => req.status === 'completed').length;


  const formatTimestamp = (timestamp: string | undefined) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: ErrandRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'in-progress':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 text-foreground">
      <Header />
      <main className="flex-1 p-4 md:p-8 space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalRequests}</div>
                    <p className="text-xs text-muted-foreground">All errands submitted over time</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pendingRequests}</div>
                    <p className="text-xs text-muted-foreground">Errands waiting for a rider</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed Errands</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{completedRequests}</div>
                    <p className="text-xs text-muted-foreground">Successfully delivered errands</p>
                </CardContent>
            </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Errand Requests</CardTitle>
            <CardDescription>View and manage all incoming errand requests.</CardDescription>
          </CardHeader>
          <CardContent>
             {fetchError ? (
                <div className="text-center text-red-500 py-10">
                    <p><strong>Error:</strong> {fetchError.message}</p>
                    <p className="text-sm text-muted-foreground mt-2">This is often caused by missing Row Level Security (RLS) policies on your 'requests' table. Please check your Supabase project settings.</p>
                </div>
             ) : requests.length === 0 ? (
              <div className="text-center text-muted-foreground py-10">
                No errand requests found.
              </div>
            ) : (
            <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Dispatcher</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="hidden md:table-cell">Task</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Submitted At</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {requests.map((request) => (
                    <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.dispatcherName}</TableCell>
                        <TableCell>{request.dispatcherPhone}</TableCell>
                        <TableCell className="hidden md:table-cell">{request.taskType}</TableCell>
                        <TableCell>
                            {getStatusBadge(request.status)}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{formatTimestamp(request.created_at)}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

// Set revalidate to 0 to make this page dynamic and always fetch fresh data
export const revalidate = 0;
