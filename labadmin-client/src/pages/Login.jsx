import React from 'react';
import AuthLayout from './AuthLayout';
import SignInForm from '../components/auth/SignInForm';
// We can add PageMeta later for setting the document title

export default function LoginPage() {
  return (
    <>
      {/* <PageMeta
          title="LabAdmin@2025-26"
          description="LabAdmin is laboratory management system"
        /> 
      */}
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}