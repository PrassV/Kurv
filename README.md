# KURVE Website

The official website for Kurve.ai - The Operating System for Reality.

## Design

- **Aesthetic:** Brutalist/Industrial
- **Background:** Dark (#0a0a0a)
- **Typography:** 
  - Headlines: Inter / Helvetica Neue (sans-serif)
  - Data points: JetBrains Mono / Roboto Mono (monospaced)
- **Visual Style:** Abstract data visualizations, topology maps, stark lines

## Features

- **Animated Network Graph:** Rotating 3D network visualization in hero section
- **Scroll-Triggered Animations:**
  - 47-Dimension Human Decoder visualization
  - Building-to-Logic-Blocks transformation
- **Interactive Elements:**
  - Smooth scroll navigation
  - Command prompt-style contact button
  - Hover effects on buttons

## Getting Started

Simply open `index.html` in a modern web browser. No build process required.

### Local Development

For best results, serve the files through a local web server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser.

## File Structure

```
Kurv/
├── index.html      # Main HTML structure
├── styles.css     # All styling and animations
├── script.js      # Interactive features and canvas animations
└── README.md      # This file
```

## Customization

- **Contact Email:** Update the email in the footer section of `index.html` and the `initContactButton()` function in `script.js`
- **Headquarters:** Update the city in the footer section of `index.html`
- **Colors:** Modify CSS variables in `styles.css` (`:root` section)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Notes

- All animations use Canvas API for performance
- Intersection Observer API is used for scroll-triggered animations
- Responsive design included for mobile devices

