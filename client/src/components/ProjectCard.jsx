import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// This component renders one portfolio project with a hover-only detail action.
function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project.id}`} className="project-card">
      <div className="project-image-wrap">
        <img src={project.image} alt={project.title} />
        <div className="project-hover">
          <span>View full page</span>
          <ArrowUpRight size={19} />
        </div>
        <div className="project-card-overlay">
          <span>{project.category}</span>
          <strong>{project.title}</strong>
        </div>
      </div>
    </Link>
  );
}

export default ProjectCard;
