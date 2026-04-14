# AGENTS.md

This file provides guidelines for agentic coding assistants working in this repository.

## Build & Development Commands

```bash
# Development
pnpm dev                    # Start development server with nodemon (runs tsx)
pnpm prisma generate         # Generate Prisma client after schema changes

# Production
pnpm build                  # Compile TypeScript to dist/ + prisma generate
pnpm start                  # Run production build (node dist/app.js)

# Database
pnpm prisma db push         # Sync schema changes to database
docker compose up -d        # Start PostgreSQL container

# Testing
pnpm test                   # Run tests in watch mode
pnpm test:coverage          # Run tests and generate coverage report
npx vitest run              # Run tests once (no watch mode)
npx vitest run <file>       # Run specific test file
```

## Code Style Guidelines

### Imports
- Use ES6 import/export syntax
- Use `@/` alias for `src/` directory imports
- Group imports with blank lines: external libs, internal modules, types/interfaces
- Example:
  ```ts
  import express from 'express';
  import { z } from 'zod';

  import { AuthRepository } from '@/domain/repositories/auth.repository';
  import { BadRequestException } from '@/shared/exceptions/bad-request';
  ```

### Naming Conventions
- Files: `kebab-case.ts` (e.g., `auth.repository.ts`, `create-product.dto.ts`)
- Classes/Interfaces: `PascalCase` (e.g., `CreateProduct`, `AuthRepository`)
- Variables/Functions: `camelCase` (e.g., `userRepository`, `validateId`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `PORT`, `FRONT_END_URL`)
- DTOs: `entityName.dto.ts` (e.g., `login.dto.ts`, `create-product.dto.ts`)
- Use Cases: `action-entity.ts` (e.g., `register.ts`, `create-product.ts`)

### TypeScript Configuration
- Strict mode enabled (see `tsconfig.json`)
- Use `@/` path alias for internal imports
- Export inferred types from Zod schemas
- Avoid `any` type - use specific types or `unknown`

### DTOs (Data Transfer Objects)
- Use `zod` for schema validation
- Always use `z.strictObject()` for DTOs
- Export inferred type: `export type DtoType = z.infer<typeof dtoName>`
- Include descriptive error messages in validation rules
- Example:
  ```ts
  export const registerDto = z.strictObject({
    email: z.string().email().trim(),
    password: z.string().min(8),
  });
  export type RegisterDtoType = z.infer<typeof registerDto>;
  ```

### Controllers
- Use factory pattern returning object with async handler methods
- Parse DTOs with `.parse(req.body)` at start of handler
- Validate IDs with `validateId(req.params.id)` utility
- Use ResponseHandler for success/error responses
- Wrap handlers in try-catch with ResponseHandler.handleException()
- Example:
  ```ts
  export const authController = (repo: AuthRepository) => ({
    register: async (req: Request, res: Response) => {
      const dto = registerDto.parse(req.body);
      try {
        const useCase = new Register(repo);
        const data = await useCase.execute(dto);
        return ResponseHandler.ok(res, message, data, 201);
      } catch (error) {
        return ResponseHandler.handleException(res, error, fallbackMessage);
      }
    }
  });
  ```

### Use Cases
- Define interface first: `interface UseCaseName { execute(...): Promise<...> }`
- Implement class with private readonly dependencies
- Keep business logic here, not in controllers or datasources
- Example:
  ```ts
  export interface CreateProductUseCase {
    execute(dto: CreateProductDtoType): Promise<ProductEntity>;
  }
  export class CreateProduct implements CreateProductUseCase {
    constructor(private readonly repository: ProductRepository) {}
    async execute(dto: CreateProductDtoType): Promise<ProductEntity> {
      // business logic
      return this.repository.create(dto);
    }
  }
  ```

### Error Handling
- Use custom exceptions from `@/shared/exceptions/`
- BadRequestException (400), UnauthorizedException (401)
- Use ResponseHandler.handleException() in controllers
- Throw exceptions in use cases for business logic violations
- ResponseHandler automatically handles ZodError and Prisma errors

### Architecture Layers
- `domain/`: Business logic (entities, repositories interfaces, use cases, DTOs, datasources interfaces)
- `infrastructure/`: Implementation details (repository implementations, datasource implementations, external services)
- `presentation/`: HTTP layer (controllers, routes, server)
- `shared/`: Shared utilities (auth, http, exceptions, messages, services, utils, value-objects)
- `generated/`: Prisma client (auto-generated, do not edit)

### Validation
- All request body validation via Zod DTOs in controllers
- Use `validateId()` utility for ID parameters
- Phone number validation: use libphonenumber-js
- Email validation: Zod's built-in email()
- Custom validation in use cases when business rules require it

### Messages & Internationalization
- Store user-facing messages in `@/shared/messages/index.ts`
- Group by feature (auth, product, etc.)
- Use functions for dynamic messages: `messages.auth.loginSuccess(name)`
- Keep messages in Spanish as per current codebase

### Database
- Use Prisma ORM via generated client at `@/generated/client`
- Database connection in `@/data/postgresql`
- Run `pnpm prisma generate` after schema changes
- Use repository pattern to abstract Prisma calls

### Comments
- Write self-documenting code
- Comments only when logic is complex or non-obvious
- Do not add comments for obvious code

### File Organization
- Follow existing directory structure
- Group related files in feature directories
- Keep related files together (repository + repository.impl, datasource + datasource.impl)
- Routes should live in `presentation/[feature]/routes.ts`
