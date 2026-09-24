import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import ProjectCard from './components/ProjectCard';
import StatCard from './components/StatCard';
import StatusBadge from './components/StatusBadge';
import UploadBox from './components/UploadBox';
import PortfolioPage from './pages/PortfolioPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import { createRemoteProject, deleteRemoteProject, fetchProjects, updateRemoteProject } from './services/projectApi';
import { loadStoredProjects, saveStoredProjects } from './services/projectStorage';
import { getCurrentAdmin, logoutAdmin, requestLoginOtp, verifyLoginOtp } from './services/authApi';
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  Code2,
  Eye,
  FolderKanban,
  GitBranch,
  LayoutDashboard,
  Link as LinkIcon,
  LogOut,
  Mail,
  Menu,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';

const imageLibrary = {
  nexora: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=85',
  vertex: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=85',
  spaces: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85',
  food: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85',
  career: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85',
};

const portfolioCategories = ['All', 'Wordpress', 'HTML Templates', 'React JS'];

const starterProjects = [
  {
    id: 'nexora-ai',
    title: 'Nexora AI Landing Page',
    category: 'HTML Templates',
    description: 'Modern AI landing page with clean design and smooth animations.',
    longDescription: 'A conversion-focused landing page for an AI automation studio. The experience pairs a bright editorial layout with clear product storytelling, motion-led details, and a compact visual system built for fast scanning.',
    technologies: ['React', 'Tailwind', 'Framer'],
    image: imageLibrary.nexora,
    screenshots: [imageLibrary.nexora, imageLibrary.career],
    status: 'published',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    updatedAt: 'Sep 20, 2026',
  },
  {
    id: 'vertex-structures',
    title: 'Vertex Structures',
    category: 'Wordpress',
    description: 'Architecture and construction company website with modern UI.',
    longDescription: 'A high-impact business website for a structural engineering practice. Dark timber tones, oversized type, and measured page transitions make the company feel precise and established.',
    technologies: ['React', 'Node.js', 'MongoDB'],
    image: imageLibrary.vertex,
    screenshots: [imageLibrary.vertex, imageLibrary.spaces],
    status: 'published',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    updatedAt: 'Sep 18, 2026',
  },
  {
    id: 'spaces-designed',
    title: 'Spaces Designed',
    category: 'HTML Templates',
    description: 'Interior design portfolio website with elegant and modern design.',
    longDescription: 'An image-first portfolio for an interior studio. The build uses calm typography, immersive project imagery, and a simple filtering rhythm to let the spaces stay at the center of the story.',
    technologies: ['React', 'Tailwind', 'GSAP'],
    image: imageLibrary.spaces,
    screenshots: [imageLibrary.spaces, imageLibrary.vertex],
    status: 'draft',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    updatedAt: 'Sep 15, 2026',
  },
  {
    id: 'food-delivery',
    title: 'Food Delivery Website',
    category: 'React JS',
    description: 'Modern food ordering platform with cart and payment integration.',
    longDescription: 'A focused ecommerce flow for a food delivery brand, with warm product photography, quick discovery, and a checkout experience designed to remove friction on smaller screens.',
    technologies: ['React', 'Node.js', 'MongoDB'],
    image: imageLibrary.food,
    screenshots: [imageLibrary.food, imageLibrary.nexora],
    status: 'published',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    updatedAt: 'Sep 12, 2026',
  },
  {
    id: 'careertrack',
    title: 'CareerTrack',
    category: 'React JS',
    description: 'Student internship and job portal platform with authentication.',
    longDescription: 'A practical job-search workspace that helps students find opportunities, track applications, and keep momentum through a clear, friendly dashboard.',
    technologies: ['React', 'Express', 'MongoDB'],
    image: imageLibrary.career,
    screenshots: [imageLibrary.career, imageLibrary.nexora],
    status: 'published',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    updatedAt: 'Sep 10, 2026',
  },
];

function useProjects() {
  const [projects, setProjects] = useState([]);
  const localProjects = useRef(null);

  useEffect(() => {
    loadStoredProjects().then((storedProjects) => { localProjects.current = storedProjects; }).catch((error) => console.error('Could not read local migration data:', error));
    fetchProjects().then(setProjects).catch((error) => console.error('Could not load public projects:', error));
  }, []);

  // This function loads only the shared projects so every browser sees the same portfolio.
  const refreshProjects = async (includeDrafts = false) => {
    const remoteProjects = await fetchProjects(includeDrafts);
    if (includeDrafts && remoteProjects.length === 0 && localProjects.current?.length) {
      const migratedProjects = [];
      for (const project of localProjects.current) migratedProjects.push(await createRemoteProject({ ...project, id: undefined, _id: undefined }));
      setProjects(migratedProjects);
      await saveStoredProjects(migratedProjects);
      return migratedProjects;
    }
    setProjects(remoteProjects);
    return remoteProjects;
  };

  // This function synchronizes project additions, edits, and deletions with MongoDB.
  const saveProjects = async (nextProjects) => {
    try {
      const previousProjects = projects;
      const previousIds = new Set(previousProjects.map((project) => project.id));
      const nextIds = new Set(nextProjects.map((project) => project.id));
      for (const project of previousProjects) if (!nextIds.has(project.id) && project.id) await deleteRemoteProject(project.id);
      const savedProjects = [];
      for (const project of nextProjects) savedProjects.push(previousIds.has(project.id) ? await updateRemoteProject(project) : await createRemoteProject({ ...project, id: undefined, _id: undefined }));
      setProjects(savedProjects);
      return true;
    } catch (error) {
      console.error('Could not save projects:', error);
      return error.message || false;
    }
  };

  return { projects, saveProjects, refreshProjects };
}

function App() {
  const { projects, saveProjects, refreshProjects } = useProjects();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    getCurrentAdmin().then((authenticated) => { setIsAuthenticated(authenticated); if (authenticated) refreshProjects(true); }).catch(() => setIsAuthenticated(false)).finally(() => setAuthChecked(true));
  }, []);

  // This function clears the temporary admin session and returns the visitor to the login screen.
  const logout = async () => {
    await logoutAdmin();
    setIsAuthenticated(false);
  };

  // This function refreshes shared projects immediately after OTP login succeeds.
  const handleAuthenticated = () => { setIsAuthenticated(true); refreshProjects(true).catch((error) => console.error('Could not load admin projects:', error)); };

  if (!authChecked) return null;

  return (
    <Routes>
      <Route path="/" element={<PortfolioPage projects={projects} categories={portfolioCategories} />} />
      <Route path="/projects/:projectId" element={<ProjectDetailPage projects={projects} />} />
      <Route path="/admin/login" element={<AdminLogin onAuthenticated={handleAuthenticated} />} />
      <Route
        path="/admin/*"
        element={isAuthenticated ? <AdminShell projects={projects} saveProjects={saveProjects} onLogout={logout} /> : <Navigate to="/admin/login" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function Portfolio({ projects }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = portfolioCategories;
  const visibleProjects = projects.filter((project) => project.status === 'published' && (activeCategory === 'All' || project.category === activeCategory));

  return (
    <main className="site-shell">
      <section className="portfolio-hero">
        <div className="hero-topline">
          <div className="profile-lockup">
            <div className="avatar avatar-large">SR</div>
            <div>
              <p className="eyebrow">MERN stack developer</p>
              <h1>Soom Raj.</h1>
              <div className="seller-line"><span className="level-badge">Level<br />1</span><span>Level 1 Seller</span></div>
            </div>
          </div>
          <a className="button button-lime" href="https://www.fiverr.com/soomraj02" target="_blank" rel="noreferrer">Contact me on Fiverr <ArrowUpRight size={18} /></a>
        </div>
        <div className="category-tabs" aria-label="Project categories">
          {categories.map((category) => <button key={category} className={activeCategory === category ? 'category-tab active' : 'category-tab'} onClick={() => setActiveCategory(category)}>{category}</button>)}
        </div>
      </section>
      <section className="work-section">
        <div className="project-grid">{visibleProjects.map((project) => <ProjectCard key={project.id} project={project} />)}</div>
      </section>
      <footer className="site-footer"><div><strong>Soom Raj.</strong><span>Designing and building useful digital things.</span></div><a href="mailto:hello@soomraj.dev"><Mail size={16} /> hello@soomraj.dev</a></footer>
    </main>
  );
}

function ProjectDetail({ projects }) {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const project = projects.find((item) => item.id === projectId);
  if (!project || project.status !== 'published') return <Navigate to="/" replace />;

  const optionalScreenshots = (project.screenshots || []).filter(Boolean);
  return <main className="detail-page"><button className="back-button" onClick={() => navigate(-1)}><ArrowLeft size={17} /> Back to work</button><div className="detail-header"><div><p className="eyebrow">{project.category} / Case study</p><h1>{project.title}</h1></div><div className="detail-actions"><a className="button button-dark" href={project.liveUrl} target="_blank" rel="noreferrer">Live website <ArrowUpRight size={17} /></a><a className="icon-button" href={project.githubUrl} target="_blank" rel="noreferrer" aria-label="Open GitHub"><GitBranch size={18} /></a></div></div><div className="detail-hero"><img src={project.image} alt={project.title} /><div className="detail-hero-label"><span>Project  /  {project.id}</span><span>2026</span></div></div><div className="detail-content"><div><p className="eyebrow">The brief</p><h2>A digital experience that feels as good as it works.</h2></div><div><p className="detail-description">{project.longDescription}</p><div className="tech-list">{project.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div></div></div>{optionalScreenshots.length > 0 && <div className="detail-gallery">{optionalScreenshots.map((screenshot, index) => <img key={`${screenshot}-${index}`} src={screenshot} alt={`${project.title} screen ${index + 1}`} />)}</div>}</main>;
}

function AdminLogin({ onAuthenticated }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // This function asks the server to email a one-time code to the owner.
  const handleRequestOtp = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try { await requestLoginOtp(email); setStep('otp'); } catch (requestError) { setError(requestError.message); } finally { setBusy(false); }
  };

  // This function verifies the email code and opens the protected dashboard session.
  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try { await verifyLoginOtp(email, otp); onAuthenticated(); navigate('/admin'); } catch (verifyError) { setError(verifyError.message); } finally { setBusy(false); }
  };

  return <main className="login-page"><div className="login-aside"><div className="brand-mark">Soom Raj <span></span></div><div className="login-aside-copy"><p className="eyebrow">Portfolio admin</p><h1>Welcome back.</h1><p>Manage your projects.<br />Keep your portfolio moving.</p></div><span className="aside-caption">BUILD / LEARN / GROW / REPEAT</span></div><div className="login-panel"><form className="login-card" onSubmit={step === 'email' ? handleRequestOtp : handleVerifyOtp}><div className="avatar avatar-medium">SR</div><p className="eyebrow">Private workspace</p><h2>{step === 'email' ? 'Admin login' : 'Check your email'}</h2><p className="muted">{step === 'email' ? 'Enter your owner email to receive a login code.' : `Enter the 6-digit code sent to ${email}.`}</p>{step === 'email' ? <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></label> : <label>One-time code<input inputMode="numeric" pattern="[0-9]{6}" maxLength="6" value={otp} onChange={(event) => setOtp(event.target.value)} placeholder="000000" required /></label>}{error && <p className="form-error">{error}</p>}<button className="button button-dark full-width" type="submit" disabled={busy}>{busy ? 'Please wait...' : step === 'email' ? 'Send login code' : 'Verify and login'} <ArrowUpRight size={17} /></button>{step === 'otp' && <button className="back-link" type="button" onClick={() => setStep('email')}>Use a different email</button>}<Link className="back-link" to="/"><ArrowLeft size={15} /> Back to website</Link></form></div></main>;
}

function AdminShell({ projects, saveProjects, onLogout }) {
  const location = useLocation();
  const [mobileNav, setMobileNav] = useState(false);
  const isProjects = location.pathname.includes('/projects');
  const isAdd = location.pathname.includes('/add');
  const title = isAdd ? 'Add new project' : isProjects ? 'Projects' : 'Dashboard';
  const subtitle = isAdd ? 'Fill in the details below to add a new project to your portfolio.' : isProjects ? 'Manage your portfolio projects and what appears on your website.' : 'Manage your portfolio projects from here.';

  return <div className="admin-layout"><aside className={mobileNav ? 'admin-sidebar open' : 'admin-sidebar'}><div className="admin-brand"><div className="avatar">SR</div><div><strong>Soom Raj.</strong><span>MERN Developer</span></div></div><nav><Link className={!isProjects && !isAdd ? 'nav-link active' : 'nav-link'} to="/admin" onClick={() => setMobileNav(false)}><LayoutDashboard size={17} /> Dashboard</Link><Link className={isProjects ? 'nav-link active' : 'nav-link'} to="/admin/projects" onClick={() => setMobileNav(false)}><FolderKanban size={17} /> Projects</Link><Link className={isAdd ? 'nav-link active' : 'nav-link'} to="/admin/add-project" onClick={() => setMobileNav(false)}><Plus size={17} /> Add project</Link></nav><button className="logout-link" onClick={onLogout}><LogOut size={17} /> Logout</button></aside><div className="admin-main"><header className="admin-topbar"><button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle navigation">{mobileNav ? <X /> : <Menu />}</button><span>Portfolio admin</span><div className="admin-user"><div className="avatar avatar-small">SR</div><strong>Soom Raj</strong><ChevronDown size={15} /></div></header><div className="admin-content"><div className="admin-heading"><div><p className="breadcrumb">Dashboard <span>/</span> {title}</p><h1>{title}</h1><p className="muted">{subtitle}</p></div>{isProjects && <Link className="button button-dark" to="/admin/add-project"><Plus size={17} /> Add new project</Link>}</div><Routes><Route index element={<Dashboard projects={projects} />} /><Route path="projects" element={<ProjectsAdmin projects={projects} saveProjects={saveProjects} />} /><Route path="add-project" element={<AddProject projects={projects} saveProjects={saveProjects} />} /></Routes></div></div></div>;
}

function Dashboard({ projects }) {
  const published = projects.filter((project) => project.status === 'published').length;
  const drafts = projects.length - published;
  return <><div className="stats-grid"><StatCard icon={<FolderKanban />} label="Total projects" value={projects.length} tone="green" /><StatCard icon={<Eye />} label="Published" value={published} tone="blue" /><StatCard icon={<Pencil />} label="Draft" value={drafts} tone="yellow" /></div><section className="admin-panel"><div className="panel-heading"><div><p className="eyebrow">Latest updates</p><h2>Recent projects</h2></div><Link to="/admin/projects">View all <ArrowUpRight size={15} /></Link></div><div className="recent-list">{projects.slice(0, 5).map((project) => <div className="recent-row" key={project.id}><img src={project.image} alt="" /><div><strong>{project.title}</strong><span>{project.category}</span></div><StatusBadge status={project.status} /><span className="muted">{project.updatedAt}</span></div>)}</div></section></>;
}

function ProjectsAdmin({ projects, saveProjects }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();
  const categories = portfolioCategories;
  const filteredProjects = projects.filter((project) => (filter === 'All' || project.category === filter) && `${project.title} ${project.description}`.toLowerCase().includes(search.toLowerCase()));

  // This function changes publication visibility immediately and preserves the draft in admin storage.
  const toggleStatus = (projectId) => saveProjects(projects.map((project) => project.id === projectId ? { ...project, status: project.status === 'published' ? 'draft' : 'published' } : project));

  // This function removes a project only after the owner confirms the destructive action.
  const deleteProject = (projectId) => { if (window.confirm('Delete this project?')) saveProjects(projects.filter((project) => project.id !== projectId)); };

  return <section className="admin-panel project-manager"><div className="filters"><label className="search-field"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search projects..." /></label><select value={filter} onChange={(event) => setFilter(event.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></div><div className="table-wrap"><table><thead><tr><th>#</th><th>Project</th><th>Category</th><th>Technologies</th><th>Status</th><th>Actions</th></tr></thead><tbody>{filteredProjects.map((project, index) => <tr key={project.id}><td className="muted">{String(index + 1).padStart(2, '0')}</td><td><div className="table-project"><img src={project.image} alt="" /><div><strong>{project.title}</strong><span>{project.description}</span></div></div></td><td><span className="category-chip">{project.category}</span></td><td><div className="technology-chips">{project.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div></td><td><button className={project.status === 'published' ? 'toggle on' : 'toggle'} onClick={() => toggleStatus(project.id)} aria-label={`Set ${project.title} ${project.status === 'published' ? 'draft' : 'published'}`}><span></span></button></td><td><div className="action-buttons"><button className="icon-button" onClick={() => navigate(`/admin/add-project?edit=${project.id}`)} aria-label="Edit project"><Pencil size={16} /></button><button className="icon-button danger" onClick={() => deleteProject(project.id)} aria-label="Delete project"><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div></section>;
}

function AddProject({ projects, saveProjects }) {
  const navigate = useNavigate();
  const params = new URLSearchParams(useLocation().search);
  const editId = params.get('edit');
  const editingProject = projects.find((project) => project.id === editId);
  const [form, setForm] = useState(editingProject ? { ...editingProject, screenshots: [...(editingProject.screenshots || []), '', '', '', ''].slice(0, 4) } : { title: '', description: '', category: 'HTML Templates', technologies: [], status: 'published', image: '', screenshots: ['', '', '', ''], liveUrl: '', githubUrl: '' });
  const [technologyInput, setTechnologyInput] = useState('');
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  // This function updates one form field while keeping the project draft predictable.
  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  // This function adds a technology tag when the owner presses Enter.
  const addTechnology = (event) => { if (event.key === 'Enter' && technologyInput.trim()) { event.preventDefault(); updateField('technologies', [...form.technologies, technologyInput.trim()]); setTechnologyInput(''); } };

  // This function creates or replaces a project and then returns to the project manager.
  const handleSubmit = async (event) => { event.preventDefault(); const project = { ...form, id: form.id || `${form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now()}`, image: form.image || imageLibrary.nexora, screenshots: form.screenshots.filter(Boolean), updatedAt: 'Just now', longDescription: form.description }; const payloadSize = new Blob([JSON.stringify(project)]).size; if (payloadSize > 4000000) { const message = 'These images are too large for Vercel. Use fewer or smaller screenshots, or connect Cloudinary for heavy images.'; setSaveError(message); window.alert(message); return; } const saveResult = await saveProjects(form.id ? projects.map((item) => item.id === form.id ? project : item) : [project, ...projects]); if (saveResult !== true) { const message = typeof saveResult === 'string' ? saveResult : 'Could not save this project.'; setSaveError(message); window.alert(message); return; } setSaveError(''); setSaved(true); setTimeout(() => navigate('/admin/projects'), 450); };

  return <form className="project-form" onSubmit={handleSubmit}><div className="form-main"><label>Project title <span>*</span><input value={form.title} onChange={(event) => updateField('title', event.target.value)} placeholder="e.g. Nexora AI Landing Page" required /></label><label>Short description <span>*</span><textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} placeholder="Write a short description about the project..." maxLength={500} required /><small>{form.description.length}/500</small></label><div className="form-row"><label>Category <span>*</span><select value={form.category} onChange={(event) => updateField('category', event.target.value)}>{portfolioCategories.slice(1).map((category) => <option key={category}>{category}</option>)}</select></label><label>Status <span>*</span><select value={form.status} onChange={(event) => updateField('status', event.target.value)}><option value="published">Published</option><option value="draft">Draft</option></select></label></div><label>Technologies <span>*</span><input value={technologyInput} onChange={(event) => setTechnologyInput(event.target.value)} onKeyDown={addTechnology} placeholder="Add technologies, press Enter after each" />{form.technologies.length > 0 && <div className="form-tags">{form.technologies.map((tech) => <button type="button" key={tech} onClick={() => updateField('technologies', form.technologies.filter((item) => item !== tech))}>{tech} <X size={12} /></button>)}</div>}</label><label>Live website URL<input value={form.liveUrl} onChange={(event) => updateField('liveUrl', event.target.value)} placeholder="https://yourwebsite.com" /></label><label>GitHub URL<input value={form.githubUrl} onChange={(event) => updateField('githubUrl', event.target.value)} placeholder="https://github.com/username/repo" /></label><div className="form-actions"><button className="button button-dark" type="submit">{saved ? <><Check size={16} /> Saved</> : <><Check size={16} /> {editingProject ? 'Update project' : 'Save project'}</>}</button><button className="button button-quiet" type="button" onClick={() => navigate('/admin/projects')}>Cancel</button></div></div><div className="form-side"><UploadBox label="Main screenshot" image={form.image} onChange={(value) => updateField('image', value)} large /><div className="additional-screens"><div className="side-heading"><strong>Additional screenshots</strong><span>Optional</span></div><div className="upload-grid">{[0, 1, 2, 3].map((index) => <UploadBox key={index} label={`Screenshot ${index + 1}`} image={form.screenshots[index]} onChange={(value) => { const screenshots = [...form.screenshots]; screenshots[index] = value; updateField('screenshots', screenshots); }} />)}</div></div></div></form>;
}

export default App;
