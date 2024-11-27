import { Suspense } from 'react'
import LoginForm from '@/components/LoginForm'
import RegisterForm from '@/components/RegisterForm'
import Dashboard from '@/components/Dashboard'

export default function Home() {
  return (
    <div className="space-y-8">
      <Suspense fallback={<div>Loading...</div>}>
        <Dashboard />
      </Suspense>
      <div className="mt-8 flex gap-4 justify-center">
        <LoginForm />
        <RegisterForm />
      </div>
    </div>
  )
}

