// src/app/layout.tsx

export const metadata = {
  title: '3D Map App',
  description: 'Basic 3D map with Next.js and Three.js',
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;