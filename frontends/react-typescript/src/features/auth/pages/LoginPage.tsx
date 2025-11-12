import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/cards'
import { Container } from '@/shared/ui/layout'
import { LoginForm } from '../ui/LoginForm'

/**
 * LoginPage
 * 
 * Route-bound container that orchestrates the login flow.
 * Assembles UI components and handles navigation.
 * 
 * @example
 * <Route path="/login" element={<LoginPage />} />
 */
export function LoginPage() {
  const navigate = useNavigate()
  
  const handleLoginSuccess = () => {
    navigate('/dashboard')
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20">
      <Container size="sm">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </CardHeader>
          <CardContent>
            <LoginForm onSuccess={handleLoginSuccess} />
          </CardContent>
        </Card>
      </Container>
    </div>
  )
}
