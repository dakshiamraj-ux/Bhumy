'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  FirebaseError,
} from 'firebase/auth';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type FormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleAuthError = (error: FirebaseError) => {
     let title = 'Authentication Failed';
     let description = 'An unexpected error occurred. Please try again.';
     
     switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            title = 'Invalid Credentials';
            description = 'The email or password you entered is incorrect.';
            break;
        case 'auth/email-already-in-use':
            title = 'Email Exists';
            description = 'This email is already registered. Please log in instead.';
            break;
        case 'auth/weak-password':
            title = 'Weak Password';
            description = 'Your password should be at least 6 characters long.';
            break;
        case 'auth/popup-closed-by-user':
            title = 'Google Sign-In Canceled';
            description = 'You closed the Google Sign-In window before completing the process.';
            break;
        default:
            console.error('Firebase Auth Error:', error);
            break;
     }

     toast({
        variant: 'destructive',
        title: title,
        description: description,
     });
  }

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      if (isLoginView) {
        await signInWithEmailAndPassword(auth, values.email, values.password);
      } else {
        await createUserWithEmailAndPassword(auth, values.email, values.password);
      }
      // On success, AuthStateGate will handle redirect
    } catch (error) {
      handleAuthError(error as FirebaseError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        // On success, AuthStateGate will handle redirect
    } catch (error) {
        handleAuthError(error as FirebaseError);
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm border-0 shadow-xl bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>{isLoginView ? 'Welcome Back!' : 'Create an Account'}</CardTitle>
        <CardDescription>
          {isLoginView ? 'Sign in to continue your green journey.' : 'Join Bhumy to start making a difference.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoginView ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
        </Form>
        <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
        </div>
         <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
                <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
                    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
                    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
                    <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C44.591 35.008 48 29.837 48 24c0-1.341-.138-2.65-.389-3.917z"></path>
                </svg>
              }
              Google
        </Button>
        <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
          <button
            onClick={() => {
                setIsLoginView(!isLoginView);
                form.reset();
            }}
            className="underline underline-offset-4 hover:text-primary focus:outline-none"
          >
            {isLoginView ? "Don't have an account? Sign up." : 'Already have an account? Sign in.'}
          </button>
        </p>
      </CardContent>
    </Card>
  );
}
