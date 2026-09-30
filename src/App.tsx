import { useState, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { BackgroundVideo } from './components/BackgroundVideo';
import { Hero } from './components/Hero';
import { LoadingScreen } from './components/LoadingScreen';

export function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleVideoLoaded = useCallback(() => {
    // Add small buffer for buttery smooth fade
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, []);

  return (
    <main className="relative w-full h-screen min-h-screen overflow-hidden bg-black text-white">
      {/* Loading Screen Overlay */}
      <LoadingScreen isLoading={isLoading} />

      {/* Fixed Background Video scrubbed by mouse */}
      <BackgroundVideo onLoaded={handleVideoLoaded} />

      {/* Fixed Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero isReady={!isLoading} />
    </main>
  );
}

export default App;
