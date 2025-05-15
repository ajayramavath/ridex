import AuthModal from '@/components/auth/AuthModal'
import LoginForm from '@/components/auth/LoginForm'
import React from 'react'

const LoginPage = () => {
  return (
    <AuthModal
      title='Login'
      description='Login to your account to start using RideX'
    >
      <LoginForm />
    </AuthModal >
  )
}

export default LoginPage