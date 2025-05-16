import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { GlitchEffect } from "@/components/glitch-effect"
import { GridBackground } from "@/components/grid-background"

export default function ForgotPasswordPage() {
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
          <p className="mt-2 text-gray-400">Reset your password</p>
        </div>

        <Card className="border border-gray-800 bg-black/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-cyan-400">Forgot Password</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="bg-gray-900/60 border-gray-700 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/20"
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-medium">
              Send Reset Link
            </Button>
            <p className="text-sm text-center text-gray-400">
              Remember your password?{" "}
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
