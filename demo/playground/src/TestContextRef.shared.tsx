/**
 * Shared Context Module for TestContextRef Tests
 *
 * Both TestContextRef.tsx and TestContextRef.html.tsx need identically
 * the same context Symbol objects for @-prefix context resolution to work.
 * This module defines them once — both files import from here instead of
 * calling createContext() at their own module scope.
 */
import { createContext } from 'woby'

// Create contexts once — the Symbol() identity is the same everywhere
export const AppCounterCtx = createContext(0)
export const AppTextCtx = createContext('default-text')
export const AppFlagCtx = createContext(false)
export const ScopedCtx = createContext(100)