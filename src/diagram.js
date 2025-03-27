// Global variables
let currentZoom = 1;
const zoomStep = 0.15;
let isDragging = false;
let startX, startY;
let translateX = 0;
let translateY = 0;

// Zoom functions
export function zoomIn() {
  currentZoom = Math.min(currentZoom + zoomStep, 3);
  updateTransform();
  return currentZoom;
}

export function zoomOut() {
  currentZoom = Math.max(currentZoom - zoomStep, 0.5);
  updateTransform();
  return currentZoom;
}

export function resetZoom() {
  currentZoom = 1;
  translateX = 0;
  translateY = 0;
  updateTransform();
  return currentZoom;
}

function updateTransform() {
  const container = document.getElementById('container');
  if (container) {
    container.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
  }
}

// Theme functions
export function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  return isDark;
}

// Fullscreen functions
export function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    return true;
  } else {
    document.exitFullscreen();
    return false;
  }
}

// Download functions
export async function downloadImage() {
  const svg = document.querySelector('.mermaid svg');
  if (!svg) return null;

  const svgData = new XMLSerializer().serializeToString(svg);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  return new Promise((resolve) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.download = 'architecture-diagram.png';
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      resolve(link);
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  });
}

// Node interaction functions
export function setupNodeInteractions() {
  const nodes = document.querySelectorAll('.node');
  const tooltip = document.getElementById('tooltip');

  nodes.forEach(node => {
    node.addEventListener('mouseenter', (e) => {
      const rect = node.querySelector('rect');
      if (rect) {
        rect.style.fill = 'var(--accent-color)';
      }

      if (tooltip) {
        tooltip.classList.add('visible');
        tooltip.style.left = `${e.pageX + 10}px`;
        tooltip.style.top = `${e.pageY + 10}px`;
        tooltip.textContent = node.querySelector('text')?.textContent || '';
      }
    });

    node.addEventListener('mouseleave', () => {
      const rect = node.querySelector('rect');
      if (rect) {
        rect.style.fill = '';
      }

      if (tooltip) {
        tooltip.classList.remove('visible');
      }
    });
  });
}

// Initialize
export function initializeDiagram() {
  setupNodeInteractions();
  
  // Initialize theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }
  
  // Initialize Mermaid
  mermaid.initialize({
    startOnLoad: true,
    theme: 'base',
    securityLevel: 'loose',
  });
} 