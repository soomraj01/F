import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    longDescription: { type: String, default: '' },
    category: { type: String, required: true, trim: true },
    technologies: { type: [String], default: [] },
    image: { type: String, required: true },
    screenshots: { type: [String], default: [] },
    status: { type: String, enum: ['published', 'draft'], default: 'draft' },
    liveUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
  },
  { timestamps: true },
);

export const Project = mongoose.model('Project', projectSchema);
