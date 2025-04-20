import { Navigate } from 'react-router-dom';
import { Card } from '@heroui/card';
import { IconPackage } from '@tabler/icons-react';

import useAuth from '@/hooks/useAuth';

const Home = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace={true} />;

  return (
    <section>
      <h1>¡Bienvenido, {user.name}!</h1>

      <article>
        <Card className="bg-glass" radius="sm">
          <div>
            <p>16</p>
            <span>Pedidos Activos</span>
          </div>

          <div className="p-4 rounded-full bg-warning/20">
            <IconPackage className="text-warning-50" stroke={1.5} size={32} />
          </div>
        </Card>
      </article>
    </section>
  );
};

export default Home;
