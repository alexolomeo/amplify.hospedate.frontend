## Commit Message Guidelines

Follow the structure below for writing commit messages:

### Format

```bash
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Allowed Types

- `feat`: A new feature.
- `fix`: A bug fix.
- `docs`: Changes to documentation.
- `style`: Code style changes (e.g., formatting, no logic changes).
- `refactor`: Code restructuring.
- `test`: Adding or modifying tests.
- `chore`: Maintenance or configuration changes.

### Examples

- feat(api): add JWT authentication
- fix(ui): resolve dropdown alignment issue
- chore(deps): update Django to 5.1.4

For more information visit the [Conventional Commit Guide](https://www.conventionalcommits.org/en/v1.0.0/).

## Branch Naming Guidelines

- Use lowercase letters and hyphens (-) as separators for readability.
- Prefix branch names to indicate the type of work being done (e.g., feature, bugfix, hotfix).
- Include issue or ticket identifiers to link branches with your project management system (Jira).
- Add a brief description of the work being done.

### Suggested Naming Format

```bash
<type>/<ticket-id>-<short-description>
```

### Types and Examples

#### Feature Branches: For new features or functionality.

```bash
feature/1234-user-authentication
feature/5678-add-payment-integration
```

#### Bugfix Branches: For fixing reported bugs.

```bash
bugfix/2345-fix-login-error
bugfix/6789-correct-api-docs
```

#### Hotfix Branches: For urgent fixes to production.

```bash
hotfix/9999-fix-critical-issue
hotfix/10001-patch-security-vulnerability
```

#### Release Branches: For preparing a release version.

```bash
release/1.0.0
release/2.1.0
```

#### Experiment Branches (optional): For experimental work.

```bash
experiment/test-new-framework
experiment/api-optimization
```

#### Chore/Task Branches: For tasks like updating dependencies, refactoring, or adding tests.

```bash
chore/update-dependencies
chore/add-logging
```
