import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, Trash2 } from "lucide-react"
import { useNavigate } from 'react-router-dom'
import axiosInstance from '@/lib/axiosInstance'

interface Form {
  id: number;
  name: string;
  items: {
    id: number;
    name: string;
    question: string;
    type: string;
    step: number;
  }[];
  status: {
    id: number;
    status: string;
  }[];
}

export default function Forms() {
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchForms()
  }, [])

  const fetchForms = async () => {
    try {
      const response = await axiosInstance.get('/user-forms')
      setForms(response.data)
    } catch (error) {
      console.error('Error fetching forms:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (formId: number) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      try {
        await axiosInstance.delete(`/user-forms/${formId}`)
        fetchForms() // Refresh the list
      } catch (error) {
        console.error('Error deleting form:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p>Loading forms...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  console.log(forms)

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Forms</h1>
        <Button onClick={() => navigate('/forms/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Form
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Forms</CardTitle>
        </CardHeader>
        <CardContent>
          {forms.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No forms created yet</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/forms/create')}
              >
                Create your first form
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forms && forms?.length > 0 && forms.map((form: Form) => (
                  <TableRow key={form.id}>
                    <TableCell className="font-medium">{form.name}</TableCell>
                    <TableCell>{form.items.length} questions</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {form.status.length > 0 ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => navigate(`/forms/${form.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(form.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
