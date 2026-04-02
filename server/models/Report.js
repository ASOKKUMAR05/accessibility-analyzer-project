import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  severity: {
    type: String,
    enum: ['critical', 'serious', 'moderate', 'minor']
  },
  element: String,
  selector: String,
  category: String,
  wcagLevel: String
});

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  performanceScore: Number,
  bestPracticesScore: Number,
  seoScore: Number,
  issues: [issueSchema],
  totalIssues: {
    critical: { type: Number, default: 0 },
    serious: { type: Number, default: 0 },
    moderate: { type: Number, default: 0 },
    minor: { type: Number, default: 0 }
  },
  suggestions: [{
    type: String
  }],
  categories: {
    colorContrast: { type: Number, default: 0 },
    ariaAttributes: { type: Number, default: 0 },
    keyboardNavigation: { type: Number, default: 0 },
    semanticHTML: { type: Number, default: 0 },
    formLabels: { type: Number, default: 0 },
    images: { type: Number, default: 0 }
  },
  analyzedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
reportSchema.index({ url: 1, analyzedAt: -1 });

const Report = mongoose.model('Report', reportSchema);

export default Report;
