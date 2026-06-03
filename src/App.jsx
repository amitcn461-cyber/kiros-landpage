import { LeadModalProvider } from './context/LeadModalContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProblemSection from './components/ProblemSection'
import SolutionSection from './components/SolutionSection'
import HowItWorks from './components/HowItWorks'
import Audience from './components/Audience'
import BusinessValue from './components/BusinessValue'
import FAQ from './components/FAQ'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'
import LeadModal from './components/LeadModal'

export default function App() {
  return (
    <LeadModalProvider>
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <HowItWorks />
        <Audience />
        <BusinessValue />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <LeadModal />
    </LeadModalProvider>
  )
}
