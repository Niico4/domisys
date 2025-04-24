import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthBase } from '@modules/auth/types/auth';

import { signInSchema } from '../validations/auth.schema';

import { paths } from '@/constants/routerPaths';
import useAuth from '@/hooks/useAuth';

const SignInForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthBase>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { login, isLoading } = useAuth();

  const onSubmit = async (data: AuthBase) => {
    try {
      const success = await login(data.email, data.password);

      if (!success) return;

      navigate('/', { replace: true });
      reset();
    } catch (error) {
      console.error(error);
      toast.error(`Error al iniciar sesión`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center gap-5"
    >
      <div className="flex flex-col gap-4 w-full">
        <Input
          size="sm"
          label="Correo electrónico"
          type="email"
          isRequired
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
          {...register('email')}
        />
        <Input
          size="sm"
          label="Contraseña"
          type="password"
          isRequired
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
          {...register('password')}
        />
      </div>
      <div className="flex items-center justify-end w-full">
        <Link
          className="text-sm text-primary opacity-80 hover:opacity-100 transition-all"
          to={`/${paths.authRoot}/${paths.recoverPassword}`}
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <Button
        fullWidth
        radius="sm"
        color="primary"
        type="submit"
        isLoading={isLoading}
      >
        Iniciar Sesión
      </Button>
      <p className="text-sm">
        ¿No tienes una cuenta?{' '}
        <Link
          className="text-primary underline opacity-80 hover:opacity-100 transition-all"
          to={`/${paths.authRoot}/${paths.signUp}`}
        >
          Crear una cuenta
        </Link>
      </p>
    </form>
  );
};

export default SignInForm;
