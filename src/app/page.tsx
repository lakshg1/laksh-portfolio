import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { Ticker } from '@/components/Ticker';
import { Systems } from '@/components/Systems';
import { Pipeline } from '@/components/Pipeline';
import { Capabilities } from '@/components/Capabilities';
import { Experience } from '@/components/Experience';
import { Stack } from '@/components/Stack';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <Systems />
        <Pipeline />
        <Capabilities />
        <Experience />
        <Stack />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
