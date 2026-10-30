import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import EnvelopeCover from './components/EnvelopeCover';
import BotanicalDecorations from './components/BotanicalDecorations';
import HeroSection from './components/HeroSection';
import CountdownSection from './components/CountdownSection';
import LocationSection from './components/LocationSection';
import RsvpSection from './components/RsvpSection';
import GuestbookSection from './components/GuestbookSection';
import Footer from './components/Footer';

export default function App() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <AnimatePresence>{!opened && <EnvelopeCover onOpen={() => setOpened(true)} />}</AnimatePresence>
      {opened && (
        <main className="relative">
          <BotanicalDecorations />
          <HeroSection />
          <CountdownSection />
          <LocationSection />
          <RsvpSection />
          <GuestbookSection />
          <Footer />
        </main>
      )}
    </>
  );
}

