import useAuth from '@/hooks/useAuth';

const Home = () => {
  const { user } = useAuth();

  return (
    <section>
      <h1>¡Bienvenido, {user?.firstName}!</h1>

      <article>
        <h2>Home page repartidor</h2>
      </article>
    </section>
  );
};

export default Home;
