# Personal Knowledge Base & Learning Center Architecture

An interactive architecture diagram for the Personal Knowledge Base & Learning Center project, built with Mermaid.js and modern web technologies.

## Features

- Interactive mindmap visualization
- Dark/light theme support
- Zoom and pan controls
- Fullscreen mode
- Export to PNG
- Responsive design
- Accessibility features

## Testing

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Zcklsmith/personal-knowledge-base-architecture.git
cd personal-knowledge-base-architecture
```

2. Install dependencies:
```bash
npm install
```

### Running Tests

1. Run all tests:
```bash
npm test
```

2. Run tests in watch mode (for development):
```bash
npm run test:watch
```

3. Run tests with coverage report:
```bash
npm run test:coverage
```

### Test Coverage

The test suite covers:
- Diagram rendering and updates
- Theme switching
- Zoom and pan controls
- Fullscreen mode
- Export functionality
- Node interactions
- Accessibility features

## Development

### Project Structure

```
personal-knowledge-base-architecture/
├── architecture.html    # Main HTML file
├── __tests__/          # Test files
├── jest.config.js      # Jest configuration
├── jest.setup.js       # Jest setup file
├── package.json        # Project configuration
└── README.md          # Project documentation
```

### Adding New Tests

1. Create new test files in the `__tests__` directory
2. Follow the existing test patterns
3. Run tests to ensure everything passes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC 