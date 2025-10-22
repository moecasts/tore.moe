# Contributing to Astro Theme Tore

First off, thank you for considering contributing to Astro Theme Tore! It's people like you that make this theme better for everyone.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Include your environment details** (OS, Node version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any similar features in other themes**

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Write clear commit messages**
6. **Submit a pull request**

## Development Setup

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/your-username/astro-theme-tore.git
cd astro-theme-tore

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Provide proper type definitions
- Avoid using `any` type

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types

### Styling

- Use Tailwind CSS utility classes
- Follow the existing design system
- Ensure responsive design

### File Naming

- Use kebab-case for files: `my-component.tsx`
- Use PascalCase for components: `MyComponent`
- Use camelCase for functions: `myFunction`

### Code Formatting

We use Prettier and Biome for code formatting:

```bash
# Format code
pnpm format

# Check formatting
pnpm format:check

# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix
```

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: add new feature
fix: fix bug
docs: update documentation
style: format code
refactor: refactor code
test: add tests
chore: update dependencies
```

Examples:

```
feat: add dark mode toggle
fix: resolve mobile menu issue
docs: update installation guide
style: format with prettier
refactor: simplify search component
test: add unit tests for utils
chore: update astro to 5.0
```

## Testing

Before submitting a pull request:

1. **Test locally**: Run `pnpm dev` and test your changes
2. **Build test**: Run `pnpm build` to ensure it builds successfully
3. **Preview test**: Run `pnpm preview` to test the production build
4. **Cross-browser test**: Test in different browsers if possible

## Documentation

- Update README.md if you change functionality
- Add JSDoc comments for new functions
- Update type definitions
- Include examples for new features

## Project Structure

```
/
├── src/
│   ├── components/     # React components
│   ├── content/        # Content collections
│   ├── layouts/        # Astro layouts
│   ├── pages/          # Astro pages
│   └── config/         # Configuration
├── public/             # Static assets
└── docs/               # Documentation
```

## Questions?

Feel free to:

- Open an issue for questions
- Join our discussions on GitHub
- Contact the maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
