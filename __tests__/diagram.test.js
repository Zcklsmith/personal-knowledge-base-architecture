import { jest } from '@jest/globals';
import {
  zoomIn,
  zoomOut,
  resetZoom,
  toggleTheme,
  toggleFullscreen,
  downloadImage,
  setupNodeInteractions,
  initializeDiagram
} from '../src/diagram.js';

describe('Diagram Functionality', () => {
  let localStorageMock;

  beforeEach(() => {
    localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
      removeItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });

    document.body.innerHTML = `
      <div class="wrapper" id="wrapper">
        <div class="mermaid-container" id="container">
          <div class="mermaid">
            <svg>
              <g class="node" id="node-root">
                <rect></rect>
                <text>Root</text>
              </g>
              <g class="node" id="node-n1">
                <rect></rect>
                <text>Node 1</text>
              </g>
            </svg>
          </div>
        </div>
      </div>
      <div class="controls">
        <div class="control-group zoom-controls">
          <button class="control-button" onclick="zoomIn()">Zoom In (+)</button>
          <button class="control-button" onclick="zoomOut()">Zoom Out (-)</button>
          <button class="control-button" onclick="resetZoom()">Reset</button>
        </div>
        <div class="control-group view-controls">
          <button class="control-button" onclick="toggleFullscreen()">Fullscreen</button>
          <button class="control-button" onclick="downloadImage()">Download</button>
        </div>
      </div>
      <button class="theme-toggle" onclick="toggleTheme()">Toggle Theme</button>
      <div id="tooltip"></div>
    `;
    
    setupNodeInteractions();
  });

  describe('Zoom Controls', () => {
    it('should increase zoom level when zooming in', () => {
      const initialZoom = 1;
      const newZoom = zoomIn();
      expect(newZoom).toBeGreaterThan(initialZoom);
    });

    it('should decrease zoom level when zooming out', () => {
      const initialZoom = 1;
      const newZoom = zoomOut();
      expect(newZoom).toBeLessThan(initialZoom);
    });

    it('should reset zoom level when resetting', () => {
      zoomIn();
      zoomIn();
      const newZoom = resetZoom();
      expect(newZoom).toBe(1);
    });
  });

  describe('Theme Toggle', () => {
    it('should toggle between light and dark theme', () => {
      const isDark = toggleTheme();
      expect(document.body.classList.contains('dark-theme')).toBe(isDark);
      
      const isLight = toggleTheme();
      expect(document.body.classList.contains('dark-theme')).toBe(isLight);
    });

    it('should persist theme preference in localStorage', () => {
      toggleTheme();
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });
  });

  describe('Fullscreen Toggle', () => {
    it('should toggle fullscreen mode', () => {
      const mockRequestFullscreen = jest.fn();
      const mockExitFullscreen = jest.fn();
      
      document.documentElement.requestFullscreen = mockRequestFullscreen;
      document.exitFullscreen = mockExitFullscreen;

      const isFullscreen = toggleFullscreen();
      expect(mockRequestFullscreen).toHaveBeenCalled();
      expect(isFullscreen).toBe(true);

      document.fullscreenElement = document.documentElement;
      const isNotFullscreen = toggleFullscreen();
      expect(mockExitFullscreen).toHaveBeenCalled();
      expect(isNotFullscreen).toBe(false);
    });
  });

  describe('Download Functionality', () => {
    it('should create download link for PNG export', async () => {
      // Mock canvas and context
      const mockCanvas = {
        getContext: jest.fn().mockReturnValue({
          drawImage: jest.fn()
        }),
        toDataURL: jest.fn().mockReturnValue('data:image/png;base64,test')
      };

      // Mock XMLSerializer
      window.XMLSerializer = jest.fn().mockImplementation(() => ({
        serializeToString: jest.fn().mockReturnValue('<svg></svg>')
      }));

      // Mock Image
      class MockImage {
        constructor() {
          setTimeout(() => this.onload(), 0);
        }
        set src(value) {
          this._src = value;
        }
        get src() {
          return this._src;
        }
      }
      window.Image = MockImage;

      // Mock createElement
      const originalCreateElement = document.createElement;
      document.createElement = jest.fn().mockImplementation((tag) => {
        if (tag === 'canvas') return mockCanvas;
        return originalCreateElement.call(document, tag);
      });

      const link = await downloadImage();
      expect(link).toBeDefined();
      expect(link.download).toBe('architecture-diagram.png');
      expect(link.href).toBe('data:image/png;base64,test');

      // Restore original createElement
      document.createElement = originalCreateElement;
    });
  });

  describe('Node Interactions', () => {
    it('should highlight nodes on hover', () => {
      const node = document.querySelector('#node-n1');
      node.dispatchEvent(new MouseEvent('mouseenter'));
      
      const rect = node.querySelector('rect');
      expect(rect.style.fill).toBe('var(--accent-color)');
      
      node.dispatchEvent(new MouseEvent('mouseleave'));
      expect(rect.style.fill).toBe('');
    });

    it('should show tooltip on node hover', () => {
      const node = document.querySelector('#node-n1');
      const tooltip = document.getElementById('tooltip');
      
      node.dispatchEvent(new MouseEvent('mouseenter'));
      expect(tooltip.classList.contains('visible')).toBe(true);
      
      node.dispatchEvent(new MouseEvent('mouseleave'));
      expect(tooltip.classList.contains('visible')).toBe(false);
    });
  });
}); 