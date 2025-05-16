import { GridBackground } from "@/components/grid-background"

export default function DashboardLoading() {
  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center">
      <GridBackground className="opacity-30" />

      <div className="flex flex-col items-center z-10">
        <div className="w-24 h-24 relative">
          <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-cyan-400 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-r-2 border-l-2 border-purple-600 animate-spin animation-delay-150"></div>
          <div className="absolute inset-4 rounded-full border-t-2 border-b-2 border-cyan-400 animate-spin animation-delay-300"></div>
          <div className="absolute inset-6 rounded-full border-r-2 border-l-2 border-purple-600 animate-spin animation-delay-450"></div>
        </div>

        <h2 className="mt-8 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
          Loading Dashboard
        </h2>
        <p className="mt-2 text-gray-400">Initializing security systems...</p>
      </div>
    </div>
  )
}
