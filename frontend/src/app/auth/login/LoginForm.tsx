'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addToast, Button, Input, Link } from '@heroui/react';

import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth.service';
import { handleApiError } from '@/utils/error-handler';

import { LoginPayloadType, loginPayloadSchema } from './login.schema';

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginPayloadType>({
    resolver: zodResolver(loginPayloadSchema),
    defaultValues: {
      emailOrUsername: '',
      password: '',
    },
    mode: 'all',
  });

  const onSubmit = async (payload: LoginPayloadType) => {
    setIsLoading(true);

    try {
      const { emailOrUsername, password } = payload;
      const data = await authService.login(emailOrUsername, password);

      if (!data) return;

      setUser(data.user);

      addToast({
        color: 'success',
        title: '¡Inicio de sesión exitoso!',
        description: `¡Bienvenido de nuevo, ${data.user.name}!`,
      });

      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Input
          size="sm"
          type="text"
          label="Correo electrónico o nombre de usuario"
          isRequired
          isDisabled={isLoading}
          isInvalid={!!errors.emailOrUsername}
          errorMessage={errors.emailOrUsername?.message}
          {...register('emailOrUsername')}
        />
        <Input
          size="sm"
          type="password"
          label="Contraseña"
          isRequired
          isDisabled={isLoading}
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
          {...register('password')}
        />

        <Link
          href="#"
          className="text-sm block text-right font-medium text-neutral-100"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <Button type="submit" className="bg-[#FFE0B2]" isLoading={isLoading}>
        Iniciar sesión
      </Button>
    </form>
  );
};

export default LoginForm;
