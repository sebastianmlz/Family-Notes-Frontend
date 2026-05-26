# Core Pillars for Professional Angular Frontend Development

## Purpose
This skill establishes an absolute, non-negotiable architectural contract for the AI agent. Every component, service, model, or template implemented MUST strictly adhere to the five foundational pillars of enterprise-grade engineering: Professionalism, Quality, Efficiency, Scalability, and Security.

---

## Pillar 1: Professionalism (Standards & Ecosystem alignment)
The agent must treat the codebase as a high-tier production ecosystem by enforcing modern workflows and tools:
- [cite_start]**Modern Stack Restrictions:** Write code exclusively tailored for Angular (v21+), utilizing 100% Standalone Components architecture[cite: 1550, 1592]. [cite_start]Absolutely NO legacy `.module.ts` files are allowed in this project[cite: 1550, 1592].
- [cite_start]**Package Management:** Strictly use `pnpm` execution contexts for managing, running, or installing dependencies[cite: 1549, 2268].
- **Code Maintenance:** When modifying files, never blindly rewrite entire blocks. Provide target line-by-line diff replacements, explicitly documenting technical changes.

## Pillar 2: Quality (Maintainability & Clean Code)
The agent must guarantee code integrity, type safety, and standardized formatting at all times:
- [cite_start]**Strict Typing Contracts:** The use of the `any` keyword is completely prohibited[cite: 1534, 2034]. [cite_start]Every data structure, payload, form value, or API response must be strictly bound to a strongly typed `.interface.ts` or `.model.ts` contract[cite: 1534, 2037].
- **Compilation Rigor:** Enable and enforce `strictNullChecks` within TypeScript profiles to prevent any unexpected null or undefined pointer exceptions during runtime.
- [cite_start]**Form Controls Quality:** Build validation flows strictly over Angular Reactive Forms utilizing `nonNullable` property groupings[cite: 2626, 2694]. [cite_start]Visual error notifications must remain hidden until the user has explicitly interacted with (`touched`) the field[cite: 2684].

## Pillar 3: Efficiency (Performance & Resource Optimization)
The agent must optimize execution speed, minimize memory consumption, and deliver fluid UI rendering:
- [cite_start]**Fine-Grained Reactivity:** Use Angular Signals exclusively for synchronous client view states, component interactions, and UI states [cite: 1533, 1556-1557, 2921]. [cite_start]Expose state variables from services as read-only streams using `.asReadonly()` to completely avoid unexpected out-of-bounds state mutations[cite: 1534, 2582, 2590].
- [cite_start]**Asynchronous Stream Management:** Restrict RxJS Observables solely to handle actual asynchronous operations, event-driven pipelines, debounced user typing, or native HTTP request flows [cite: 1535-1536, 1561-1563, 2922].
- [cite_start]**Hardware-Accelerated UI (Tailwind CSS v4 + PrimeNG v21):** Outsource all application transitions and layout movements to the browser's hardware graphics card using native CSS animations [cite: 1540-1541, 1573, 2444, 2462]. [cite_start]Do NOT import or install legacy JavaScript animation frameworks (`provideAnimationsAsync` is deprecated peso muerto)[cite: 1541, 2445, 2463]. [cite_start]Configure strict cascade layering rules (`@layer theme, base, primeng`) so Tailwind classes overwrite base widgets without bloating the style sheets with `!important` flags[cite: 1572, 1574, 2324].

## Pillar 4: Scalability (Clean Architecture & Structural Discipline)
The agent must design decoupled systems prepared for infinite feature expansion without increasing initial payloads:
- **Domain-Driven Directory Organization:** Segment all code within `src/app/` into strict, isolated architectural layers:
  1. [cite_start]🛡️ `/core`: Housing single-instance infrastructure services (e.g., authentication services), functional HTTP interceptors, and global route guards [cite: 1565-1567, 1999-2000, 2643].
  2. [cite_start]🧩 `/shared`: Reusable, layout-agnostic components, pipes, or visual widgets without any embedded business logic [cite: 1567, 2001-2003].
  3. [cite_start]🚀 `/features`: Highly isolated, feature-specific folders representing unique application domains [cite: 1568, 2004-2006, 2752].
- [cite_start]**Chunk Partitioning (Lazy Loading):** Features must manage their own internal routing files to allow the framework to break the build into atomic, deferred code chunks [cite: 1569-1570, 2007-2009, 2948]. [cite_start]Users must only download the specific bytes of the feature they are actively navigating[cite: 1570, 2008, 2949].

## Pillar 5: Security (Data Isolation & Protection)
The agent must implement bulletproof data handling patterns to shield information on the client layer:
- [cite_start]**Decoupled Security Lines:** Core system tools (Interceptors and Route Guards) must never depend on or look inside the visual `/features` directory [cite: 2641-2642, 2646]. [cite_start]All global authentications must rely on safe, low-level abstractions stored within `/core`[cite: 2643, 2648].
- [cite_start]**Functional Network Pipeline Validation:** Secure route navigation using lightweight functional route filters (`CanActivateFn`) that return a native `UrlTree` to block double-navigation layout bugs[cite: 2952, 3024].
- [cite_start]**Isolate Network Interception:** Inject Authorization headers strictly using Functional HTTP Interceptors (`HttpInterceptorFn`) [cite: 1541-1542, 1590]. [cite_start]Use strict domain verification rules (`isApiUrl`) to ensure access tokens are never accidentally leaked to external or third-party web domains [cite: 2518-2519, 2526-2527].
- [cite_start]**Environment Disconnection:** Hardcoding backend domains or parameters inside services or visual views is completely prohibited [cite: 2971-3042]. [cite_start]All application environments must dynamically pull base endpoints directly from Swapped Environment files[cite: 2972, 3043].