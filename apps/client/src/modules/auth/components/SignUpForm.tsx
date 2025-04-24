import { Button } from '@heroui/button';
import { Checkbox } from '@heroui/checkbox';
import { Input } from '@heroui/input';
import { InputOtp } from '@heroui/input-otp';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { signUpSchema } from '../validations/auth.schema';
import { SignUpPayload } from '../types/auth';

import { paths } from '@/constants/routerPaths';
import useAuth from '@/hooks/useAuth';

const SignUpForm = () => {
  const navigate = useNavigate();

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<SignUpPayload>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
      password: '',
      invitationCode: '',
      isDelivery: false,
    },
  });

  const isDelivery = watch('isDelivery');

  const { signUp } = useAuth();

  const validateInvitationCode = async (code: string): Promise<boolean> => {
    return code === '12345678';
  };

  const onSubmit = async (data: SignUpPayload) => {
    try {
      if (data.isDelivery) {
        if (!data.invitationCode) return;

        const isValidCode = await validateInvitationCode(data.invitationCode);
        if (!isValidCode) {
          toast.error('Código de invitación inválido');
          return;
        }
      }

      const wasRegistered = await signUp(data);

      if (!wasRegistered) return;

      reset();
      setTimeout(() => {
        navigate(`/`, { replace: true });
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error(`Error al crear la cuenta`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex-col-center gap-5">
      <div className="flex-center gap-4">
        <Input
          required
          size="sm"
          label="Nombre"
          type="text"
          isRequired
          errorMessage={errors.firstName?.message}
          isInvalid={!!errors.firstName}
          {...register('firstName')}
        />
        <Input
          required
          size="sm"
          label="Apellido"
          type="text"
          isRequired
          errorMessage={errors.lastName?.message}
          isInvalid={!!errors.lastName}
          {...register('lastName')}
        />
      </div>
      <Input
        required
        size="sm"
        label="Correo electrónico"
        type="email"
        isRequired
        errorMessage={errors.email?.message}
        isInvalid={!!errors.email}
        {...register('email')}
      />
      <div className="flex-center gap-4">
        <Input
          required
          size="sm"
          label="Teléfono"
          type="text"
          isRequired
          errorMessage={errors.phoneNumber?.message}
          isInvalid={!!errors.phoneNumber}
          {...register('phoneNumber')}
        />
        <Input
          required
          size="sm"
          label="Dirección"
          type="text"
          isRequired
          errorMessage={errors.address?.message}
          isInvalid={!!errors.address}
          {...register('address')}
        />
      </div>
      <div className="flex-center gap-4">
        <Input
          required
          size="sm"
          label="Contraseña"
          type="password"
          isRequired
          errorMessage={errors.password?.message}
          isInvalid={!!errors.password}
          {...register('password')}
        />
        <Input
          required
          size="sm"
          label="Repetir Contraseña"
          type="password"
          isRequired
          errorMessage={errors.confirmPassword?.message}
          isInvalid={!!errors.confirmPassword}
          {...register('confirmPassword')}
        />
      </div>

      <div className="flex flex-col items-start justify-center gap-5 w-full">
        <Checkbox
          defaultSelected
          isSelected={isDelivery}
          aria-label="repartidor"
          onValueChange={(val) => setValue('isDelivery', val)}
          {...register('isDelivery')}
        >
          Repartidor
        </Checkbox>
        {isDelivery && (
          <div className="flex flex-col justify-center w-full gap-4 p-4 rounded-lg bg-white/[0.03]">
            <Controller
              control={control}
              name="invitationCode"
              render={({ field }) => (
                <InputOtp
                  description="Ingresa tu código de invitación"
                  type="password"
                  classNames={{ description: 'text-gray' }}
                  {...field}
                  errorMessage={
                    errors.invitationCode && errors.invitationCode.message
                  }
                  isInvalid={!!errors.invitationCode}
                  length={8}
                />
              )}
            />
          </div>
        )}
      </div>

      <Button
        fullWidth
        radius="sm"
        color="primary"
        type="submit"
        className="mt-4"
      >
        Crear Cuenta
      </Button>
      <p className="text-sm">
        ¿Ya tienes una cuenta?{' '}
        <Link
          className="text-primary underline opacity-80 hover:opacity-100 transition-all"
          to={`/${paths.authRoot}/${paths.signIn}`}
        >
          Iniciar sesión
        </Link>
      </p>
    </form>
  );
};

export default SignUpForm;
