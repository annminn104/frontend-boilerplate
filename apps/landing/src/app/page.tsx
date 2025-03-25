import Introduction from '@/components/sections/Introduction'
import TechStack from '@/components/sections/TechStack'
import WorkExperience from '@/components/sections/WorkExperience'
import Projects from '@/components/sections/Projects'
import Contact from '@/components/sections/Contact'

export default function Home() {
  return (
    <main>
      <Introduction />
      <TechStack />
      <WorkExperience />
      <Projects />
      <Contact />
    </main>
  )
}
