import { Loader2 } from 'lucide-react'

export default function LoadingComponent() {
  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin mx-auto text-green-600" />
    </div>
  )
}
