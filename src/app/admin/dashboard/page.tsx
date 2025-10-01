
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
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

type ErrandRequest = {
  id: string;
  dispatcherName: string;
  dispatcherPhone: string;
  taskType: string;
  pickupLocation: string;
  dropoffLocation: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Timestamp;
};

async function getErrandRequests(): Promise<ErrandRequest[]> {
  if (!db) {
    console.log('Firestore is not configured. Returning empty array.');
    return [];
  }

  try {
    const requestsRef = collection(db, 'requests');
    const q = query(requestsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return [];
    }

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        dispatcherName: data.dispatcherName,
        dispatcherPhone: data.dispatcherPhone,
        taskType: data.taskType,
        pickupLocation: data.pickupLocation,
        dropoffLocation: data.dropoffLocation,
        status: data.status,
        createdAt: data.createdAt,
      };
    });
  } catch (error) {
     console.error('Error fetching errand requests:', error);
     // In a real app, you'd want to handle this more gracefully
     // For now, we'll return an empty array to prevent crashing
     return [];
  }
}

export default async function DashboardPage() {
  const requests = await getErrandRequests();

  const formatTimestamp = (timestamp: Timestamp | Date | undefined) => {
    if (!timestamp) return 'N/A';
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>View and manage all incoming errand requests.</CardDescription>
          </CardHeader>
          <CardContent>
             {requests.length === 0 ? (
              <div className="text-center text-muted-foreground py-10">
                No errand requests found.
              </div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dispatcher</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.dispatcherName}</TableCell>
                    <TableCell>{request.dispatcherPhone}</TableCell>
                    <TableCell>{request.taskType}</TableCell>
                    <TableCell>
                      <Badge variant={request.status === 'pending' ? 'secondary' : 'default'}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatTimestamp(request.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

// Set revalidate to 0 to make this page dynamic and always fetch fresh data
export const revalidate = 0;
