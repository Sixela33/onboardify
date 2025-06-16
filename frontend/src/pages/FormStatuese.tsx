import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axiosInstance from '@/lib/axiosInstance';

interface FormStatus {
  id: number;
  phoneNumber: string;
  actualStep: number;
  form: {
    id: number;
    name: string;
    items: Array<{
      id: number;
      step: number;
      question: string;
    }>;
  };
}

export default function FormStatuses() {
  const [formStatuses, setFormStatuses] = useState<FormStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFormStatuses = async () => {
      try {
        const response = await axiosInstance.get('/user-forms/form-status');
        setFormStatuses(response.data);
      } catch (error) {
        console.error('Error fetching form statuses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormStatuses();
  }, []);

  const getProgressPercentage = (actualStep: number, totalSteps: number) => {
    return Math.round(((actualStep-1) / totalSteps) * 100);
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Form Completion Status</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Form Name</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Current Step</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formStatuses && formStatuses.length > 0 && formStatuses.map((status: FormStatus) => {
                  const totalSteps = status.form.items.length;
                  const progress = getProgressPercentage(status.actualStep, totalSteps);
                  const isCompleted = status.actualStep > totalSteps;

                  console.log("status", status);


                  return (
                    <TableRow key={status.id}>
                      <TableCell>{status.phoneNumber}</TableCell>
                      <TableCell>{status.form.name}</TableCell>
                      <TableCell>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">{progress}%</span>
                      </TableCell>
                      <TableCell>
                        {isCompleted ? 'Completed' : `Step ${status.actualStep} of ${totalSteps}`}
                      </TableCell>
                      <TableCell>
                        <Badge variant={isCompleted ? "default" : "secondary"}>
                          {isCompleted ? 'Completed' : 'In Progress'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
