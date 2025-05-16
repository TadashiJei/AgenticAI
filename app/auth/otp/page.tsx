import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GlitchEffect } from "@/components/glitch-effect"
import { GridBackground } from "@/components/grid-background"

export default function OTPPage() {
  return (
    <div className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-center p-4 overflow-hidden">
      <GridBackground />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <GlitchEffect>
              <h1 className="text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
                DefenSys.ai
              </h1>
            </GlitchEffect>
          </Link>
          <p className="mt-2 text-gray-400">Two-factor authentication</p>
        </div>

        <Card className="border border-gray-800 bg-black/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-cyan-400">Verification Code</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Enter the 6-digit code sent to your device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="flex justify-between gap-2">
                {[...Array(6)].map((_, i) => (
                  <Input
                    key={i}
                    type="text"
                    maxLength={1}
                    className="w-12 h-12 text-center text-xl bg-gray-900/60 border-gray-700 text-white focus:border-cyan-400 focus:ring-cyan-400/20"
                  />
                ))}
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  Didn't receive a code?{" "}
                  <button className="text-cyan-400 hover:text-cyan-300 transition-colors">Resend</button>
                </p>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-medium">
              Verify
            </Button>
            <p className="text-sm text-center text-gray-400">
              <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Back to login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

      <div className="absolute bottom-4 text-center text-xs text-gray-500">
        <p>© 2025 DefenSys.ai. All rights reserved.</p>
      </div>
    </div>
  )
}
