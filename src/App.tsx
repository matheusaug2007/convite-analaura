import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import EnvelopeCover from './components/EnvelopeCover';
import BotanicalDecorations from './components/BotanicalDecorations';
import HeroSection from './components/HeroSection';
import CountdownSection from './components/CountdownSection';
import LocationSection from './components/LocationSection';
import GiftsSection from './components/GiftsSection';
import RsvpSection from './components/RsvpSection';
import Footer from './components/Footer';
import BottomDock from './components/BottomDock';

export default function App() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <AnimatePresence>{!opened && <EnvelopeCover onOpen={() => setOpened(true)} />}</AnimatePresence>
      {opened && (
        <main className="relative pb-24">
          <BotanicalDecorations />
          <HeroSection />
          <CountdownSection />
          <LocationSection />
          <GiftsSection />
          <RsvpSection />
          <Footer />
          <BottomDock />
        </main>
      )}
    </>
  );
}
