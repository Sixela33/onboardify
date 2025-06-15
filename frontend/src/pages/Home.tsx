import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  AlertCircle,
  DollarSign,
  XCircle
} from "lucide-react"
import { Button } from '@/components/ui/button'

const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description 
}: { 
  title: string
  value: string | number
  icon: React.ElementType
  description?: string
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
    </CardContent>
  </Card>
)

const StatusCard = ({ 
  title, 
  items 
}: { 
  title: string
  items: { label: string; value: number | string; color: string }[]
}) => (
  <Card className="col-span-2">
    <CardHeader>
      <CardTitle className="text-lg font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{item.label}</p>
            </div>
            <div className={`ml-2 text-sm font-semibold ${item.color}`}>{item.value}</div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)

export default function Home() {
  // Estos datos deberían venir de tu API
  const metrics = {
    avgOnboardingTime: "2.3 días",
    incorrectSubmissions: 42,
    completionRate: "78%"
  }

  const frictionPoints = [
    { label: "Verificación de Identidad (KYC)", value: "28 clientes", color: "text-red-500" },
    { label: "Carga de Documentación", value: "15 clientes", color: "text-yellow-600" },
    { label: "Firma de Contrato Digital", value: "8 clientes", color: "text-blue-500" },
    { label: "Información de la Empresa Incompleta", value: "5 clientes", color: "text-orange-500" }
  ]

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard de Onboarding</h1>
          <p className="text-muted-foreground">
            Métricas clave del proceso de onboarding de clientes B2B.
          </p>
        </div>
        <Button>
          Nuevo Onboarding
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
        <MetricCard
          title="Tiempo Promedio de Onboarding"
          value={metrics.avgOnboardingTime}
          icon={Clock}
          description="Desde el inicio hasta la activación"
        />
        <MetricCard
          title="Envíos Incorrectos"
          value={metrics.incorrectSubmissions}
          icon={XCircle}
          description="Documentos o datos rechazados"
        />
        <MetricCard
          title="Tasa de Completitud"
          value={metrics.completionRate}
          icon={CheckCircle2}
          description="Clientes que finalizan el proceso"
        />
      </div>

      <div className="grid gap-4 mt-8 md:grid-cols-1">
        <StatusCard
          title="Puntos de Fricción Comunes (Últimos 30 días)"
          items={frictionPoints}
        />
      </div>
    </div>
  )
} 