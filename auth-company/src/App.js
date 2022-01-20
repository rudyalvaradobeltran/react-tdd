import React from 'react';
import { AppRouter } from './app-router';
import { AuthGuard } from './utils/components/auth-guard';

const App = () => {
  return (
    <AuthGuard>
      <AppRouter />
    </AuthGuard>
  )
}

export default App;