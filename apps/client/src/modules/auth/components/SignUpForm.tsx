import { Button } from '@heroui/button';
import { Checkbox } from '@heroui/checkbox';
import { Input } from '@heroui/input';
import { InputOtp } from '@heroui/input-otp';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { signUpSchema } from '../validations/auth.schema';
import { SignUpPayload } from '../types/auth';

import { paths } from '@/constants/routerPaths';
import useAuth from '@/hooks/useAuth';

const SignUpForm = () => {
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    reset,
    handleSubmit,
    control,
    resetField,
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
      invitationCode: undefined,
      isDelivery: false,
    },
  });

  const { signUp, isLoading } = useAuth();

  useEffect(() => {
    if (registrationSuccess) {
      navigate(`/${paths.authRoot}/${paths.signIn}`, {
        replace: true,
        state: { fromSignUp: true },
      });

      setRegistrationSuccess(false);
    }
  }, [registrationSuccess, navigate]);

  const handleCheckboxChange = (value: boolean) => {
    if (!value) {
      resetField('invitationCode');
    }
    setShowCodeInput(value);
  };

  const onSubmit = async (data: SignUpPayload) => {
    try {
      const res = await signUp(data);

      if (res) {
        setTimeout(() => {
          setRegistrationSuccess(true);
          reset();
        }, 200);
      }
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
        <Controller
          control={control}
          name="isDelivery"
          render={({ field: { value, onChange } }) => (
            <Checkbox
              aria-label="código del repartidor"
              isSelected={value}
              onValueChange={(val) => {
                onChange(val);
                handleCheckboxChange(val);
              }}
            >
              Repartidor
            </Checkbox>
          )}
        />

        <AnimatePresence initial={false}>
          {showCodeInput && (
            <motion.div
              key="invitationCode"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                opacity: { duration: 0.2 },
                height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
              }}
              className="w-full overflow-hidden"
            >
              <div className="flex flex-col justify-center w-full gap-4 p-4 rounded-lg bg-white/[0.03]">
                <Controller
                  control={control}
                  name="invitationCode"
                  render={({ field }) => (
                    <InputOtp
                      description="Ingresa tu código de invitación"
                      type="password"
                      allowedKeys="^[A-Za-z0-9]*$"
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Button
        fullWidth
        radius="sm"
        color="primary"
        type="submit"
        className="mt-4"
        isLoading={isLoading}
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
