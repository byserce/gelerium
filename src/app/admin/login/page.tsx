'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email({ message: 'Geçerli bir e-posta adresi girin.' }),
  password: z.string().min(6, { message: 'Şifre en az 6 karakter olmalıdır.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      // First, try to sign in
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({ title: 'Giriş başarılı!', description: 'Yönetim paneline yönlendiriliyorsunuz.' });
      router.push('/admin/dashboard');
    } catch (signInError: any) {
      // If sign-in fails because the user does not exist, try to create a new user
      if (signInError.code === 'auth/invalid-credential' || signInError.code === 'auth/user-not-found') {
        try {
          await createUserWithEmailAndPassword(auth, data.email, data.password);
          toast({ title: 'Yeni yönetici hesabı oluşturuldu!', description: 'Yönetim paneline yönlendiriliyorsunuz.' });
          router.push('/admin/dashboard');
        } catch (signUpError: any) {
          console.error('Sign up failed after sign in failed', signUpError);
          toast({
            variant: 'destructive',
            title: 'Hesap oluşturulamadı!',
            description: 'Yeni hesap oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.',
          });
        }
      } else {
        // Handle other sign-in errors (e.g., wrong password, network error)
        console.error('Login failed', signInError);
        toast({
          variant: 'destructive',
          title: 'Giriş başarısız!',
          description: 'E-posta veya şifre hatalı.',
        });
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Admin Paneli Girişi</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-posta</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@example.com" {...field} />
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
                    <FormLabel>Şifre</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Giriş Yapılıyor...' : 'Giriş Yap / Hesap Oluştur'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
