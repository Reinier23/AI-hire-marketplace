# Consultant AI Marketplace

A modern, static AI agents hiring platform built with vanilla HTML, CSS, and JavaScript. No frameworks, build tools, or dependencies required.

## Features

- **Homepage** (`/homepage.html`) - Landing page with hero section and feature highlights
- **Marketplace Browse Page** (`/index.html`) - Search, filter, and browse AI agents
- **Agent Detail Pages** (`/agent.html`) - Comprehensive agent information with tabs
- **Responsive Design** - Mobile-first design that works on all devices
- **Search & Filtering** - Find agents by category, industry, rating, and more
- **Sorting Options** - Sort by relevance, rating, deployments, updates, or price
- **Hire Modal** - Simple form to request AI agent services
- **Offline Fallback** - Built-in data if external JSON fails to load

## File Structure

```
/
├── homepage.html       # Landing page with hero and features
├── index.html          # Marketplace browse page
├── agent.html          # Agent detail template page
├── styles.css          # All site styling
├── app.js             # Marketplace application logic
├── script.js          # Homepage interactivity
├── data/
│   └── agents.json    # AI agents data (12+ agents)
├── assets/
│   └── placeholder.svg # Placeholder agent images
└── README.md          # This file
```

## Quick Start

1. **Open `homepage.html`** to see the landing page
2. **Click "Browse AI Agents"** to go to the marketplace
3. **Browse AI agents** with search and filtering
4. **Click agent cards** to view detailed information
5. **Test the hire modal** with the pricing forms

## Site Navigation

- **Homepage** (`homepage.html`) - Company overview and value proposition
- **Marketplace** (`index.html`) - Browse and search AI agents
- **Agent Details** (`agent.html?id=agent-id`) - Individual agent information

## Deployment

### GitHub Pages
1. Create a new repository
2. Upload all files to the repository
3. Go to Settings > Pages
4. Select source branch (usually `main`)
5. Your marketplace will be available at `https://username.github.io/repository-name`

### Netlify
1. Drag and drop your project folder to [netlify.com](https://netlify.com)
2. Your marketplace will be deployed instantly
3. Get a custom subdomain or connect your own domain

### AWS S3
1. Create an S3 bucket
2. Enable static website hosting
3. Upload all files to the bucket
4. Configure bucket policy for public read access
5. Access via the S3 website endpoint

### Any Web Host
Simply upload all files to your web hosting provider's public directory.

## Customization

### Adding New Agents
Edit `data/agents.json` to add new AI agents following the existing schema:

```json
{
  "id": "unique-agent-id",
  "name": "Agent Name",
  "vendor": "Vendor Name",
  "tagline": "Brief description",
  "description": "Detailed description",
  "categories": ["category1", "category2"],
  "industries": ["industry1", "industry2"],
  "skills": ["skill1", "skill2"],
  "rating": 4.5,
  "deploymentsCount": 1000,
  "metrics": [
    {"label": "Metric Name", "value": 50, "unit": "%"}
  ],
  "priceTiers": [
    {"name": "Trial", "monthlyUsd": 0, "features": ["feature1"]}
  ],
  "compliance": ["GDPR", "SOC2"],
  "integrations": ["integration1", "integration2"],
  "lastUpdatedISO": "2024-01-01T00:00:00Z",
  "heroImageUrl": "/assets/agent-image.svg"
}
```

### Styling
Modify `styles.css` to change colors, fonts, and layout. The design uses CSS custom properties and is easily customizable.

### Functionality
- Edit `app.js` to modify marketplace search logic, filtering, or add new features
- Edit `script.js` to modify homepage interactivity and animations

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance

- **CSS**: ~18KB minified
- **JavaScript**: ~25KB minified
- **Images**: SVG placeholders (minimal size)
- **No external dependencies**
- **Fast loading** on all devices

## Accessibility

- Semantic HTML structure
- ARIA labels for form inputs
- Keyboard navigation support
- Sufficient color contrast
- Screen reader friendly

## License

This project is open source and available under the MIT License.

## Support

For questions or issues, please check the code comments or create an issue in the repository.
