import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  Eye, 
  Trash2, 
  FileText, 
  Settings, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  ChevronRight,
  GripVertical,
  Building2,
  Shield,
  Wallet,
  Users,
  ArrowRight
} from "lucide-react"
import { useNavigate } from 'react-router-dom'
import axiosInstance from '@/lib/axiosInstance'

interface Form {
  id: number;
  name: string;
  items: FormItem[];
  status: {
    id: number;
    status: string;
  }[];
}

interface FormItem {
  id: number;
  name: string;
  question: string;
  type: string;
  step: number;
  validation?: string;
  required?: boolean;
  options?: string[];
}

// Add FormItemType enum to match backend
enum FormItemType {
  TEXT = 'text',
  NUMBER = 'number',
  SELECT = 'select',
  EMAIL = 'email',
  PHONE = 'phone',
  DATE = 'date',
  FILE = 'file',
  BOOLEAN = 'boolean'
}

const questionTypes = [
  { value: FormItemType.TEXT, label: 'Texto', icon: FileText },
  { value: FormItemType.NUMBER, label: 'Número', icon: AlertCircle },
  { value: FormItemType.SELECT, label: 'Selección', icon: CheckCircle },
  { value: FormItemType.EMAIL, label: 'Email', icon: Shield },
  { value: FormItemType.PHONE, label: 'Teléfono', icon: Users },
  { value: FormItemType.DATE, label: 'Fecha', icon: FileText },
  { value: FormItemType.FILE, label: 'Archivo', icon: FileText },
  { value: FormItemType.BOOLEAN, label: 'Sí/No', icon: CheckCircle }
]

const templates = [
  {
    id: 1,
    name: 'KYC Básico',
    description: 'Verificación de identidad y datos básicos para cumplimiento regulatorio',
    category: 'Compliance',
    questions: 5,
    isActive: false,
    icon: Shield,
    color: 'bg-blue-500/10 text-blue-500'
  },
  {
    id: 2,
    name: 'Onboarding Empresarial',
    description: 'Proceso completo de registro y validación para empresas B2B',
    category: 'Empresas',
    questions: 8,
    isActive: true,
    icon: Building2,
    color: 'bg-green-500/10 text-green-500'
  },
  {
    id: 3,
    name: 'Evaluación de Riesgo',
    description: 'Evaluación detallada del perfil de riesgo financiero',
    category: 'Riesgo',
    questions: 6,
    isActive: false,
    icon: AlertCircle,
    color: 'bg-yellow-500/10 text-yellow-500'
  },
  {
    id: 4,
    name: 'Datos Bancarios',
    description: 'Recopilación de información bancaria y financiera esencial',
    category: 'Finanzas',
    questions: 4,
    isActive: false,
    icon: Wallet,
    color: 'bg-purple-500/10 text-purple-500'
  }
]

export default function Forms() {
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)
  const [showTemplates, setShowTemplates] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newForm, setNewForm] = useState({
    name: '',
    description: '',
    items: [] as FormItem[]
  })
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
    if (window.confirm('¿Estás seguro de que quieres eliminar este formulario?')) {
      try {
        await axiosInstance.delete(`/user-forms/${formId}`)
        fetchForms()
      } catch (error) {
        console.error('Error deleting form:', error)
      }
    }
  }

  const handleAddQuestion = () => {
    setNewForm(prev => ({
      ...prev,
      items: [...prev.items, {
        id: prev.items.length + 1,
        name: `question_${prev.items.length + 1}`,
        question: '',
        type: FormItemType.TEXT,
        step: prev.items.length + 1
      }]
    }))
  }

  const handleQuestionChange = (index: number, field: keyof FormItem, value: any) => {
    setNewForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!newForm.name.trim()) {
      alert('Por favor ingresa un nombre para el formulario')
      return
    }

    if (newForm.items.length === 0) {
      alert('Por favor agrega al menos una pregunta al formulario')
      return
    }

    // Validate all questions
    for (const item of newForm.items) {
      if (!item.question.trim()) {
        alert('Por favor completa todas las preguntas')
        return
      }
    }

    try {
      // Transform data to match backend DTO
      const formData = {
        name: newForm.name,
        items: newForm.items.map(item => ({
          name: item.name,
          question: item.question,
          type: item.type,
          step: item.step
        }))
      }

      await axiosInstance.post('/user-forms', formData)
      setIsCreating(false)
      setNewForm({
        name: '',
        description: '',
        items: []
      })
      await fetchForms()
    } catch (error) {
      console.error('Error creating form:', error)
      alert('Error al crear el formulario. Por favor intenta nuevamente.')
    }
  }

  const handleTemplateActivation = async (templateId: number) => {
    // Aquí iría la lógica para activar/desactivar templates
    console.log('Toggle template:', templateId)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p>Cargando formularios...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Formularios</h1>
          <p className="text-muted-foreground mt-1">
            Administra tus formularios de onboarding y templates predefinidos
          </p>
        </div>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Personalizados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {templates.map((template) => (
              <Card 
                key={template.id} 
                className={`group overflow-hidden transition-all hover:shadow-lg border-2 ${
                  template.isActive ? 'border-green-500/50' : 'hover:border-border'
                }`}
              >
                <CardHeader className="space-y-1">
                  <div className="flex justify-between items-start space-x-4">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg ${template.color}`}>
                        <template.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {template.name}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {template.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline" className={template.color}>
                        {template.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {template.questions} preguntas
                      </span>
                    </div>
                    <Button
                      variant={template.isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTemplateActivation(template.id)}
                      className="group-hover:opacity-100 transition-opacity"
                    >
                      {template.isActive ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Activo
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Activar
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom">
          {isCreating ? (
            <Card className="overflow-hidden border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Crear Nuevo Formulario</CardTitle>
                <CardDescription>
                  Diseña un formulario personalizado para tu proceso de onboarding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-4">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre del Formulario</Label>
                        <Input
                          id="name"
                          value={newForm.name}
                          onChange={(e) => setNewForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Ej: Onboarding Fintech"
                          className="transition-all focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                          id="description"
                          value={newForm.description}
                          onChange={(e) => setNewForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe el propósito de este formulario..."
                          className="transition-all focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">Preguntas</h3>
                        <p className="text-sm text-muted-foreground">
                          Agrega las preguntas que necesitas para tu proceso
                        </p>
                      </div>
                      <Button 
                        type="button" 
                        onClick={handleAddQuestion} 
                        variant="outline"
                        className="transition-all hover:shadow-md"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Pregunta
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {newForm.items.map((item, index) => (
                        <div
                          key={item.id}
                          className="group space-y-4 p-6 rounded-lg border-2 bg-card transition-all hover:border-primary/20 hover:shadow-md"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <GripVertical className="h-5 w-5 cursor-move" />
                              </div>
                              <span className="font-medium">Pregunta {index + 1}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setNewForm(prev => ({
                                  ...prev,
                                  items: prev.items.filter((_, i) => i !== index)
                                }))
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>

                          <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Pregunta</Label>
                              <Input
                                value={item.question}
                                onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                                placeholder="¿Cuál es tu pregunta?"
                                className="transition-all focus:ring-2 focus:ring-primary/20"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Tipo de Respuesta</Label>
                              <Select
                                value={item.type}
                                onValueChange={(value) => handleQuestionChange(index, 'type', value)}
                              >
                                <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
                                  <SelectValue placeholder="Selecciona un tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                  {questionTypes.map((type) => (
                                    <SelectItem 
                                      key={type.value} 
                                      value={type.value}
                                      className="flex items-center gap-2"
                                    >
                                      <type.icon className="h-4 w-4" />
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsCreating(false)}
                      className="transition-all hover:shadow-md"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit"
                      className="transition-all hover:shadow-md"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Guardar Formulario
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <>
      <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">Formularios Personalizados</h2>
                  <p className="text-muted-foreground">
                    Gestiona tus formularios personalizados para cada cliente
                  </p>
                </div>
                <Button 
                  onClick={() => setIsCreating(true)}
                  className="transition-all hover:shadow-md"
                >
          <Plus className="h-4 w-4 mr-2" />
                  Crear Nuevo Formulario
        </Button>
      </div>

      <Card>
                <CardContent className="p-0">
          {forms.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <div className="p-4 rounded-full bg-primary/10">
                        <FileText className="h-8 w-8 text-primary" />
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-lg font-medium">No hay formularios creados</h3>
                        <p className="text-muted-foreground">
                          Comienza creando tu primer formulario personalizado
                        </p>
                      </div>
              <Button 
                variant="outline" 
                        onClick={() => setIsCreating(true)}
                        className="transition-all hover:shadow-md"
              >
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Formulario
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Preguntas</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                        {forms.map((form) => (
                          <TableRow key={form.id} className="group">
                            <TableCell className="font-medium group-hover:text-primary transition-colors">
                              {form.name}
                            </TableCell>
                            <TableCell>{form.items.length} preguntas</TableCell>
                    <TableCell>
                              <Badge 
                                variant={form.status.length > 0 ? "default" : "secondary"}
                                className="transition-all"
                              >
                                {form.status.length > 0 ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => navigate(`/forms/${form.id}`)}
                                  className="transition-all hover:shadow-md"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(form.id)}
                                  className="transition-all hover:shadow-md opacity-0 group-hover:opacity-100"
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
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
