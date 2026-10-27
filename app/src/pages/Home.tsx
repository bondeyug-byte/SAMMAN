import { HeroSection, ScenarioPreview } from '../components/HomeSections';

// Experience-first homepage: understand the motive, choose a situation, start practising.
// Detailed content lives on Why SAMMAN, Learn, Practise, For educators, Evidence, Support and Privacy.
export default function Home() {
  return (
    <div className="home">
      <div className="home-top">
        <HeroSection />
      </div>
      <ScenarioPreview />
    </div>
  );
}
