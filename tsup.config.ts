import { defineConfig } from "tsup";

const extensionConfig = defineConfig({
  entry: ["src/extension.ts"],
  format: ["cjs"],
  splitting: false,
  clean: true,
  dts: true,
  shims: true,
  external: ["vscode"],
  // noExternal: [/^(?!vscode$).*/],
});

export default [extensionConfig];
