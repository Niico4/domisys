import Link from 'next/link';
import RegisterForm from './RegisterForm';

const RegisterPage = () => {
  return (
    <article className="flex flex-col gap-10">
      <div className="flex-col-center gap-4">
        <h1 className="text-4xl font-mochiy-pop-one tracking-tight">
          ¡Bienvenido!
        </h1>
        <h3 className="text-xl text-neutral-300 font-medium">
          Todo empieza aquí.
        </h3>
      </div>

      <div>
        <RegisterForm />

        <p className="text-center text-sm mt-6">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/auth/login" className="underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </article>
  );
};

export default RegisterPage;
