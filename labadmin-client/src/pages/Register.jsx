import React from 'react';
import AuthLayout from './AuthLayout';
import SignUpForm from '../components/auth/SignUpForm';

export default function RegisterPage() {
  return (
    <>
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}