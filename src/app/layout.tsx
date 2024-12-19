import { Raleway } from 'next/font/google';
import { NextUIProvider } from '@nextui-org/react';
import { ToastContainer, Bounce } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${raleway.className} antialiased`}>
        <NextUIProvider>
          {children}
          <div>
            <ToastContainer
              position="bottom-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              transition={Bounce}
            />
          </div>
        </NextUIProvider>
      </body>
    </html>
  );
}
