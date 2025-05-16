import Link from "next/link"
import { GlitchEffect } from "@/components/glitch-effect"
import {
  LayoutDashboard,
  Shield,
  WormIcon as Virus,
  Search,
  Network,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react"

export default function Sidebar() {
  return (
    <div className="w-64 h-screen border-r border-gray-800 bg-black/80 backdrop-blur-sm flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <Link href="/" className="flex items-center justify-center">
          <GlitchEffect>
            <h1 className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
              DefenSys.ai
            </h1>
          </GlitchEffect>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-md text-white bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30"
            >
              <LayoutDashboard size={18} className="text-cyan-400" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
            >
              <Shield size={18} />
              <span>Threat Detection</span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
            >
              <Virus size={18} />
              <span>Malware Analysis</span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
            >
              <Search size={18} />
              <span>Forensics</span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
            >
              <Network size={18} />
              <span>Network Security</span>
            </Link>
          </li>
        </ul>

        <div className="mt-8 pt-6 border-t border-gray-800">
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">System</h3>
          <ul className="mt-2 space-y-2">
            <li>
              <Link
                href="#"
                className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
              >
                <Bell size={18} />
                <span>Notifications</span>
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
              >
                <Settings size={18} />
                <span>Settings</span>
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
              >
                <HelpCircle size={18} />
                <span>Help & Support</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <Link
          href="/auth/login"
          className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </Link>
      </div>
    </div>
  )
}
