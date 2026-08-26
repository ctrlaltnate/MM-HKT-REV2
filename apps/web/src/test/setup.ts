import "@testing-library/jest-dom/vitest";
import { webcrypto } from "node:crypto";

const values = new Map<string, string>();
const localStorageStub: Storage = {
  get length() {
    return values.size;
  },
  clear: () => values.clear(),
  getItem: (key) => values.get(key) ?? null,
  key: (index) => [...values.keys()][index] ?? null,
  removeItem: (key) => void values.delete(key),
  setItem: (key, value) => void values.set(key, String(value)),
};

Object.defineProperty(window, "localStorage", { configurable: true, value: localStorageStub });
Object.defineProperty(window, "crypto", { configurable: true, value: webcrypto });
