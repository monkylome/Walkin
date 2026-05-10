<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Form factor

Mobile-first, and effectively mobile-only for now. Design and lay out every screen for a phone viewport — tap targets, single-column flows, bottom-nav clearance, `pt-safe` headers. Don't add desktop/tablet breakpoints, hover-only affordances, or wide-layout fallbacks unless explicitly asked.

# React: avoid useMemo and useless useEffect

- **Don't reach for `useMemo`.** Re-deriving values on render is fine in this app; React 19 + the Compiler handle the rest. Only use it if profiling shows a real cost (rare here).
- **Don't write `useEffect` that mirrors state into other state.** If you find yourself doing `setX(...)` inside an effect to keep `x` in sync with props/other state, derive `x` at render time instead. The `react-hooks/set-state-in-effect` rule will (correctly) flag it.
- Effects are for syncing with *external* systems (DOM measurements, subscriptions, timers, network). If the dependency is just other React state, it's a derivation, not an effect.
