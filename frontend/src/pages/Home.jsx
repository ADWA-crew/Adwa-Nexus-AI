import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/home/HeroSection';
import AiGuideCard from '../components/ai/AiGuideCard';

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <AiGuideCard />
    </main>
  );
}
