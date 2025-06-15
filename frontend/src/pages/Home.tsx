import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, 
  ArrowUpRight, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Building2, 
  ArrowRight,
  BadgeCheck,
  AlertCircle,
  Circle
} from "lucide-react"
import { Button } from '@/components/ui/button'

const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  description 
}: { 
  title: string
  value: string | number
  icon: React.ElementType
  trend?: { value: string; positive: boolean }
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
      <div className="flex items-center">
        <div className="flex flex-col">
          <div className="text-2xl font-bold">{value}</div>
          {trend && (
            <p className={`flex items-center text-xs ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
              <ArrowUpRight className="mr-1 h-3 w-3" />
              {trend.value}
            </p>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
)

const StatusCard = ({ 
  title, 
  items 
}: { 
  title: string
  items: { label: string; value: number; color: string }[]
}) => (
  <Card className="col-span-2">
    <CardHeader>
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{item.label}</p>
            </div>
            <div className={`ml-2 text-sm font-medium ${item.color}`}>{item.value}</div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)

export default function Home() {
  // Estos datos deberían venir de tu API
  const metrics = {
    totalClients: 156,
    activeOnboardings: 34,
    completionRate: "78%",
    avgCompletionTime: "2.3 días",
    monthlyConversions: 89,
    totalMessages: 1243
  }

  const onboardingStatuses = [
    { label: "Completados", value: 89, color: "text-green-500" },
    { label: "En Proceso", value: 34, color: "text-blue-500" },
    { label: "Pendientes", value: 12, color: "text-yellow-500" },
    { label: "Abandonados", value: 21, color: "text-red-500" }
  ]

  const verificationStatuses = [
    { label: "KYC Verificados", value: 67, color: "text-green-500" },
    { label: "Documentos Pendientes", value: 23, color: "text-yellow-500" },
    { label: "Rechazados", value: 8, color: "text-red-500" }
  ]

  const liveOnboardings = [
    { client: "Fintech Solutions SA", status: "Verificando documentos", time: "5 min", isActive: true },
    { client: "PayTech Corp", status: "Completando formulario", time: "12 min", isActive: true },
    { client: "Digital Banking Ltd", status: "Esperando respuesta", time: "3 min", isActive: false },
    { client: "CryptoServices Inc", status: "Subiendo documentos", time: "8 min", isActive: true },
  ]

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard de Onboarding</h1>
          <p className="text-muted-foreground">
            Monitorea el progreso de onboarding de tus clientes B2B
          </p>
        </div>
        <Button>
          Nuevo Onboarding
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Clientes Totales"
          value={metrics.totalClients}
          icon={Building2}
          trend={{ value: "+12% vs mes anterior", positive: true }}
        />
        <MetricCard
          title="Onboardings Activos"
          value={metrics.activeOnboardings}
          icon={Users}
          description="En proceso de verificación"
        />
        <MetricCard
          title="Tasa de Completitud"
          value={metrics.completionRate}
          icon={CheckCircle2}
          trend={{ value: "+5% vs mes anterior", positive: true }}
        />
        <MetricCard
          title="Tiempo Promedio"
          value={metrics.avgCompletionTime}
          icon={Clock}
          trend={{ value: "-0.5 días vs mes anterior", positive: true }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3 mt-4">
        <StatusCard
          title="Estado de Onboardings"
          items={onboardingStatuses}
        />
        <StatusCard
          title="Estado de Verificaciones"
          items={verificationStatuses}
        />
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Onboardings en Vivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {liveOnboardings.map((onboarding, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Circle className={`h-2 w-2 ${onboarding.isActive ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'}`} />
                    <div>
                      <p className="text-sm font-medium">{onboarding.client}</p>
                      <p className="text-xs text-muted-foreground">{onboarding.status}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{onboarding.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
        <MetricCard
          title="Conversiones Mensuales"
          value={metrics.monthlyConversions}
          icon={BadgeCheck}
          trend={{ value: "+23% vs mes anterior", positive: true }}
        />
        <MetricCard
          title="Mensajes Procesados"
          value={metrics.totalMessages}
          icon={MessageSquare}
          description="Últimos 30 días"
        />
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Alertas Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-yellow-500">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">3 clientes pendientes de documentación por más de 5 días</span>
              </div>
              <div className="flex items-center gap-2 text-red-500">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">2 verificaciones KYC rechazadas requieren atención</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 