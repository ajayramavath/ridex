import AuthModal from '@/components/auth/AuthModal'
import RegisterForm from '@/components/auth/RegisterForm'
import React from 'react'

const SignUpPage = () => {
  return (
    <AuthModal
      title='Register'
      description='Create an account to start using RideX'
    >
      <RegisterForm />
    </AuthModal>
  )
}

export default SignUpPage