import Head from 'next/head';
import ThreeScene from '@/components/ThreeScene';

const Home: React.FC = () => {
  return (
    <div>
      <Head>
        <title>3D Map App</title>
        <meta name="description" content="Basic 3D map with Next.js and Three.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <ThreeScene />
      </main>
    </div>
  );
};

export default Home;