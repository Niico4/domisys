import { UserRole } from '@/generated/enums';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
  role: UserRole;
}

export const WelcomeEmail = ({ name, role }: WelcomeEmailProps) => {
  const roleContent = getRoleContent(role);

  return (
    <Html>
      <Head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </Head>
      <Preview>Tu cuenta DomiSys está lista</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>DomiSys</Heading>
            <Text style={tagline}>Tu solución de gestión y domicilios</Text>
          </Section>

          <Section style={content}>
            <Heading style={greeting}>¡Hola {name}! 👋</Heading>

            <Text style={welcomeText}>
              Tu cuenta ha sido creada exitosamente. Ahora eres parte de nuestro
              equipo.
            </Text>

            <Section style={roleCard}>
              <Text style={roleCardTitle}>
                {roleContent.emoji} {roleContent.title}
              </Text>
              <Text style={roleCardDescription}>{roleContent.description}</Text>

              <Section style={featuresList}>
                <Text style={featuresTitle}>Funcionalidades disponibles:</Text>
                {roleContent.features.map((feature, index) => (
                  <Text key={index} style={featureItem}>
                    ✓ {feature}
                  </Text>
                ))}
              </Section>
            </Section>

            <Text style={footerText}>¡Gracias por confiar en nosotros!</Text>
          </Section>

          <Section style={footer}>
            <Text style={footerCopyright}>
              © {new Date().getFullYear()} DomiSys. Todos los derechos
              reservados.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

function getRoleContent(role: string) {
  const contents = {
    admin: {
      emoji: '👑',
      title: 'Administrador',
      description: 'Tienes control total sobre el sistema.',
      features: [
        'Gestión completa de usuarios y roles',
        'Control de inventario y productos',
        'Administración de proveedores y categorías',
        'Reportes y análisis del negocio',
        'Configuración del sistema',
      ],
    },
    customer: {
      emoji: '🛒',
      title: 'Cliente',
      description: 'Disfruta de nuestro servicio de domicilios.',
      features: [
        'Realiza pedidos fácilmente',
        'Rastrea tus envíos en tiempo real',
        'Gestiona múltiples direcciones',
        'Califica el servicio de entrega',
        'Historial de pedidos',
      ],
    },
    cashier: {
      emoji: '💰',
      title: 'Cajero',
      description: 'Gestiona las ventas en el punto de venta.',
      features: [
        'Registro de ventas',
        'Gestión de métodos de pago',
        'Consulta de productos',
        'Generación de reportes de caja',
        'Control de inventario disponible',
      ],
    },
    delivery: {
      emoji: '🚚',
      title: 'Repartidor',
      description: 'Entrega pedidos a nuestros clientes.',
      features: [
        'Ver pedidos asignados',
        'Actualizar estado de entregas',
        'Consultar direcciones de entrega',
        'Historial de entregas realizadas',
        'Recibir calificaciones de clientes',
      ],
    },
  };

  return contents[role as keyof typeof contents] || contents.customer;
}

const main = {
  backgroundColor: '#fbfbfb',
  fontFamily:
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  WebkitTextSizeAdjust: '100%' as const,
  colorScheme: 'light' as const,
};

const container = {
  backgroundColor: '#ffffff !important',
  margin: '20px auto',
  padding: '0',
  maxWidth: '600px',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 20px 60px rgba(35, 83, 71, 0.15)',
};

const header = {
  backgroundColor: '#235347 !important',
  padding: '24px 20px 20px',
  textAlign: 'center' as const,
};

const logo = {
  color: '#ffffff !important',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0',
  letterSpacing: '-0.5px',
};

const tagline = {
  color: 'rgba(255, 255, 255, 0.85) !important',
  fontSize: '13px',
  fontWeight: '400',
  margin: '6px 0 0',
  letterSpacing: '0.3px',
};

const content = {
  padding: '20px 20px 16px',
  backgroundColor: '#ffffff !important',
};

const greeting = {
  color: '#1a202c !important',
  fontSize: '20px',
  fontWeight: '700',
  margin: '0 0 10px',
  lineHeight: '1.2',
};

const welcomeText = {
  color: '#5a6c7d !important',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0 0 18px',
};

const roleCard = {
  background: 'linear-gradient(135deg, #f8faf9 0%, #e8f5f1 100%) !important',
  backgroundColor: '#f8faf9 !important',
  border: '2px solid #235347',
  borderRadius: '10px',
  padding: '16px',
  margin: '0 0 18px',
};

const roleCardTitle = {
  color: '#235347 !important',
  fontSize: '17px',
  fontWeight: '700',
  margin: '0 0 6px',
};

const roleCardDescription = {
  color: '#5a6c7d !important',
  fontSize: '13px',
  margin: '0 0 14px',
  lineHeight: '1.4',
};

const featuresList = {
  margin: '0',
};

const featuresTitle = {
  color: '#235347 !important',
  fontSize: '12px',
  fontWeight: '600',
  margin: '0 0 8px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const featureItem = {
  color: '#5a6c7d !important',
  fontSize: '13px',
  lineHeight: '1.6',
  margin: '0 0 6px',
  paddingLeft: '4px',
};

const footerText = {
  color: '#5a6c7d !important',
  fontSize: '13px',
  textAlign: 'center' as const,
  margin: '0',
  fontStyle: 'italic' as const,
  fontWeight: '500',
};

const footer = {
  backgroundColor: '#f5f7fa !important',
  padding: '16px 24px',
  textAlign: 'center' as const,
  borderTop: '1px solid #e5e7eb',
};

const footerCopyright = {
  color: '#9ca3af !important',
  fontSize: '11px',
  margin: '0',
  lineHeight: '1.4',
};

export default WelcomeEmail;
