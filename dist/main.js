import fs from "node:fs/promises";
import "./wasm_exec.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { InvalidTemplateError, TemplatingError } from "./errors.js";
const go = new Go();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let wasmInstance;
const initWasm = async () => {
    if (wasmInstance != null) {
        return wasmInstance;
    }
    const wasmBuffer = await fs.readFile(path.join(__dirname, "main.wasm"));
    const { instance } = await WebAssembly.instantiate(wasmBuffer, go.importObject);
    wasmInstance = instance;
    go.run(wasmInstance);
    return wasmInstance;
};
export const parse = async (template, values) => {
    await initWasm();
    const result = globalThis.Render(template, JSON.stringify(values));
    if (result.startsWith('Template exec error:')) {
        throw new TemplatingError(result.match(/Template exec error:.+?executing "tpl".+?: (.+)/)?.[1]);
    }
    if (result.startsWith('Template parse error:')) {
        throw new InvalidTemplateError(result);
    }
    if (result.startsWith('JSON parse error:')) {
        throw new Error(result);
    }
    return result;
};
export * from "./errors.js";
//# sourceMappingURL=main.js.map