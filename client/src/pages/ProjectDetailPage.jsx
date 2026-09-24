import { ArrowLeft, ArrowUpRight, GitBranch } from 'lucide-react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

// This page presents the complete uploaded project images without cropping them.
function ProjectDetailPage({ projects }) {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const project = projects.find((item) => item.id === projectId);
  if (!project || project.status !== 'published') return <Navigate to="/" replace />;
  const optionalScreenshots = (project.screenshots || []).filter(Boolean);

  return <main className="detail-page"><button className="back-button" onClick={() => navigate(-1)}><ArrowLeft size={17} /> Back to work</button><div className="detail-header"><div><p className="eyebrow">{project.category} / Case study</p><h1>{project.title}</h1></div><div className="detail-actions"><a className="button button-dark" href={project.liveUrl} target="_blank" rel="noreferrer">Live website <ArrowUpRight size={17} /></a><a className="icon-button" href={project.githubUrl} target="_blank" rel="noreferrer" aria-label="Open GitHub"><GitBranch size={18} /></a></div></div><div className="detail-hero"><img src={project.image} alt={project.title} /><div className="detail-hero-label"><span>Project / {project.id}</span><span>2026</span></div></div><div className="detail-content"><div><p className="eyebrow">The brief</p><h2>A digital experience that feels as good as it works.</h2></div><div><p className="detail-description">{project.longDescription}</p><div className="tech-list">{project.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div></div></div>{optionalScreenshots.length > 0 && <div className="detail-gallery">{optionalScreenshots.map((screenshot, index) => <img key={`${screenshot}-${index}`} src={screenshot} alt={`${project.title} screen ${index + 1}`} />)}</div>}</main>;
}

export default ProjectDetailPage;
