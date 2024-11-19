'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Application {
  id: string;
  flatTitle: string;
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/tenant/check-applications`, { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch applications');
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      // toast({
      //   title: "Error",
      //   description: "Failed to load applications. Please try again.",
      //   variant: "destructive",
      // });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Applications</h1>
      {applications.length === 0 ? (
        <p>You have no applications yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {applications.map((application) => (
            <Card key={application.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{application.flatTitle}</span>
                  <Badge
                    variant={
                      application.status === 'approved'
                        ? 'default' // Use 'default' for success styling
                        : application.status === 'rejected'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Applied on: {new Date(application.applicationDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    {application.status === 'approved' && <CheckCircle className="mr-2 h-4 w-4 text-green-500" />}
                    {application.status === 'rejected' && <XCircle className="mr-2 h-4 w-4 text-red-500" />}
                    {application.status === 'pending' && <Clock className="mr-2 h-4 w-4 text-yellow-500" />}
                    <span>Status: {application.status}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
