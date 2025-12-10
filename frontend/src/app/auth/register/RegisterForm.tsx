'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { addToast, Button, Checkbox, Input, InputOtp } from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';

import { handleApiError } from '@/utils/error-handler';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/hooks/useAuth';

import { registerPayloadSchema, RegisterPayloadType } from './register.schema';

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const { setUser } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterPayloadType>({
    resolver: zodResolver(registerPayloadSchema),
    defaultValues: {
      name: '',
      lastName: '',
      username: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      accessCode: undefined,
    },
    mode: 'all',
  });

  const onSubmit = async (payload: RegisterPayloadType) => {
    setIsLoading(true);
    try {
      const data = await authService.register(payload);

      if (!data) return;

      setUser(data?.user);

      // actualizar AuthInitializer
      window.dispatchEvent(new Event('auth:refresh'));

      addToast({
        color: 'success',
        title: '¡Registro exitoso!',
        description: `¡Bienvenido, ${data?.user.name}!`,
        timeout: 1000,
      });

      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const MotionForm = motion.form;

  return (
    <MotionForm
      layout
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-4">
        <div className="flex-center gap-4">
          <Input
            size="sm"
            type="text"
            label="Nombre"
            isRequired
            isDisabled={isLoading}
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
            {...register('name')}
          />

          <Input
            size="sm"
            type="text"
            label="Apellido"
            isRequired
            isDisabled={isLoading}
            isInvalid={!!errors.lastName}
            errorMessage={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        <Input
          size="sm"
          type="text"
          label="Nombre de usuario"
          placeholder="usuario"
          startContent={<span className="text-default-400 text-sm">@</span>}
          isRequired
          isDisabled={isLoading}
          isInvalid={!!errors.username}
          errorMessage={errors.username?.message}
          {...register('username')}
        />

        <Input
          size="sm"
          type="text"
          label="Correo electrónico"
          isRequired
          isDisabled={isLoading}
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
          {...register('email')}
        />

        <Input
          size="sm"
          type="text"
          label="Número de teléfono"
          isRequired
          isDisabled={isLoading}
          isInvalid={!!errors.phoneNumber}
          errorMessage={errors.phoneNumber?.message}
          {...register('phoneNumber')}
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

        <Input
          size="sm"
          type="password"
          label="Confirmar contraseña"
          isRequired
          isDisabled={isLoading}
          isInvalid={!!errors.confirmPassword}
          errorMessage={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Checkbox
          color="secondary"
          isDisabled={isLoading}
          checked={isStaff}
          onValueChange={(value) => {
            setIsStaff(value);
            if (!value) setValue('accessCode', undefined);
          }}
          classNames={{
            label: 'text-sm text-secondary-100 font-medium ',
          }}
        >
          Registrarme como personal de la empresa
        </Checkbox>

        <AnimatePresence initial={false}>
          {isStaff && (
            <motion.div
              key="otp-block"
              initial={{ maxHeight: 0, opacity: 0 }}
              animate={{ maxHeight: 160, opacity: 1 }}
              exit={{ maxHeight: 0, opacity: 0 }}
              transition={{
                maxHeight: { duration: 0.45, ease: 'easeInOut' },
                opacity: { duration: 0.25, ease: 'easeOut' },
              }}
              className="overflow-hidden"
            >
              <motion.div
                initial={{ y: -4 }}
                animate={{ y: 0 }}
                exit={{ y: -4 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="mt-3 rounded-xl border border-neutral-300 bg-primary-50 p-4 shadow-sm"
              >
                <p className="text-sm font-medium text-neutral-700 mb-2">
                  Código de acceso
                </p>

                <InputOtp
                  length={8}
                  size="sm"
                  color="primary"
                  isDisabled={isLoading}
                  isInvalid={!!errors.accessCode}
                  errorMessage={errors.accessCode?.message}
                  {...register('accessCode')}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Button type="submit" className="bg-[#FFE0B2]" isLoading={isLoading}>
        Crear cuenta
      </Button>
    </MotionForm>
  );
};

export default RegisterForm;
