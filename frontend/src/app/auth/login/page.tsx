import Link from 'next/link';
import LoginForm from './LoginForm';

const LoginPage = () => {
  return (
    <article className="flex flex-col gap-10">
      <div className="flex-col-center gap-4">
        <h1 className="text-4xl font-mochiy-pop-one tracking-tight">
          ¡Hola de nuevo!
        </h1>
        <h3 className="text-xl text-neutral-300 font-medium">
          Todo tu negocio te espera.
        </h3>
      </div>

      <div>
        <LoginForm />

        <p className="text-center text-sm mt-6">
          ¿Aún no tienes una cuenta?{' '}
          <Link href="/auth/register" className="underline">
            Regístrate
          </Link>
        </p>
      </div>
    </article>
  );
};

export default LoginPage;
