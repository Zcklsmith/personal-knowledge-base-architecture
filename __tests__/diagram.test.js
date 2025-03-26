describe('Diagram Functionality', () => {
  beforeEach(() => {
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
    `;
  });

  describe('Zoom Controls', () => {
    it('should increase zoom level when zooming in', () => {
      const initialZoom = 1;
      zoomIn();
      expect(currentZoom).toBeGreaterThan(initialZoom);
    });

    it('should decrease zoom level when zooming out', () => {
      const initialZoom = 1;
      zoomOut();
      expect(currentZoom).toBeLessThan(initialZoom);
    });

    it('should reset zoom level when resetting', () => {
      zoomIn();
      zoomIn();
      resetZoom();
      expect(currentZoom).toBe(1);
    });
  });

  describe('Theme Toggle', () => {
    it('should toggle between light and dark theme', () => {
      toggleTheme();
      expect(document.body.classList.contains('dark-theme')).toBe(true);
      
      toggleTheme();
      expect(document.body.classList.contains('dark-theme')).toBe(false);
    });

    it('should persist theme preference in localStorage', () => {
      toggleTheme();
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });
  });

  describe('Fullscreen Toggle', () => {
    it('should toggle fullscreen mode', () => {
      const mockRequestFullscreen = jest.fn();
      const mockExitFullscreen = jest.fn();
      
      document.documentElement.requestFullscreen = mockRequestFullscreen;
      document.exitFullscreen = mockExitFullscreen;

      toggleFullscreen();
      expect(mockRequestFullscreen).toHaveBeenCalled();

      document.fullscreenElement = document.documentElement;
      toggleFullscreen();
      expect(mockExitFullscreen).toHaveBeenCalled();
    });
  });

  describe('Download Functionality', () => {
    it('should create download link for PNG export', async () => {
      const mockCanvas = document.createElement('canvas');
      const mockContext = mockCanvas.getContext('2d');
      mockContext.drawImage = jest.fn();
      
      await downloadImage();
      
      const downloadLink = document.querySelector('a');
      expect(downloadLink).toBeDefined();
      expect(downloadLink.download).toBe('architecture-diagram.png');
    });
  });

  describe('Node Interactions', () => {
    it('should highlight nodes on hover', () => {
      const node = document.querySelector('#node-n1');
      node.dispatchEvent(new MouseEvent('mouseenter'));
      
      expect(node.querySelector('rect').style.fill).toBe('var(--accent-color)');
    });

    it('should show tooltip on node hover', () => {
      const node = document.querySelector('#node-n1');
      const tooltip = document.getElementById('tooltip');
      
      node.dispatchEvent(new MouseEvent('mouseenter'));
      
      expect(tooltip.classList.contains('visible')).toBe(true);
    });
  });
}); 