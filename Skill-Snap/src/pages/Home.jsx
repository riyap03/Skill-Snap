


// function Home(){


//     return(
//         <>
//         <div className="home-container">
//         <h1>Hey buddies ! Welcome to Skill Snap</h1>
//         <p> Your journey to showcase skills beautifully starts here.</p>
//         </div>
//         </>
//     );
// }

// export default Home;

import { Link } from 'react-router-dom';

import { Sparkles, Target, BookOpen } from 'lucide-react';

export default function Home() {
  return (
    <section className="home-wrap">
      <div className="home-hero">
        <h1 className="title">Welcome to <span>SkillSnap 🌻</span></h1>
        <p className="subtitle">
          Turn your learning journey into a story. Track your skills, follow AI-driven roadmaps, 
          and build a portfolio that reflects <span className="highlight">the real you</span>.
        </p>
        <p className="tagline">Your journey to showcase skills beautifully starts here.</p>
        
        <div className="cta-group">
          <Link to="/roadmap" className="btn-primary">
            <Target size={20} />
            Start Your Journey
          </Link>
          <Link to="/portfolio" className="btn-secondary">
            <Sparkles size={20} />
            View Portfolio
          </Link>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">
            <Target size={32} />
          </div>
          <h3>AI-Driven Roadmaps</h3>
          <p>Follow personalized learning paths tailored to your goals and skill level.</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">
            <BookOpen size={32} />
          </div>
          <h3>Track Progress</h3>
          <p>Check off skills as you learn them and watch your progress grow.</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">
            <Sparkles size={32} />
          </div>
          <h3>Beautiful Portfolios</h3>
          <p>Showcase your journey with a stunning portfolio that tells your story.</p>
        </div>
      </div>
    </section>
  );
}
