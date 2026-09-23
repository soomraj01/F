import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Footer from '../components/Footer';
import ProjectCard from '../components/ProjectCard';
import ProfileAvatar from '../components/ProfileAvatar';

// This page displays published portfolio work and filters it by the public categories.
function PortfolioPage({ projects, categories }) {
    const [activeCategory, setActiveCategory] = useState('All');
    const visibleProjects = projects.filter((project) => project.status === 'published' && (activeCategory === 'All' || project.category === activeCategory));

    return <main className="site-shell"><section className="portfolio-hero"><div className="hero-topline"><div className="profile-lockup"><ProfileAvatar className="avatar-large" /><div><p className="eyebrow">Fullstack developer</p><h1>Soom Raj.</h1><div className="seller-line"><span className="level-badge">Level<br />1</span><span>Level 1 Seller</span></div></div></div><a className="button button-lime" href="https://www.fiverr.com/soomraj02" target="_blank" rel="noreferrer">Contact me on Fiverr <ArrowUpRight size={18} /></a></div><div className="category-tabs" aria-label="Project categories">{categories.map((category) => <button key={category} className={activeCategory === category ? 'category-tab active' : 'category-tab'} onClick={() => setActiveCategory(category)}>{category}</button>)}</div></section><section className="work-section"><div className="project-grid">{visibleProjects.map((project) => <ProjectCard key={project.id} project={project} />)}</div></section><Footer /></main>;
}

export default PortfolioPage;
