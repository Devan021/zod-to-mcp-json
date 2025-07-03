````markdown
# zod-to-mcp-json

> 🔁 Convert Zod schemas into MCP-compatible JSON effortlessly.

[![npm version](https://badge.fury.io/js/zod-to-mcp-json.svg)](https://www.npmjs.com/package/zod-to-mcp-json)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](#license)

---

## 🧩 What is this?

`zod-to-mcp-json` is a small, fast, and powerful tool that converts [Zod](https://github.com/colinhacks/zod) schemas into a JSON format compatible with MCP (Model Configuration Protocol) or other schema-driven systems.

✅ Use it to:
- Export your Zod validation as JSON
- Share schemas between backend, frontend, or configuration tools
- Avoid duplicating type definitions manually

---

## 🚀 Installation

```bash
npm install zod-to-mcp-json
# or
yarn add zod-to-mcp-json
````

---

## 🛠️ Usage (Programmatic)

```ts
import { z } from "zod";
import { zodToMCP } from "zod-to-mcp-json";

const schema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number().default(18),
  status: z.enum(["active", "inactive"]),
  tags: z.array(z.string()),
  metadata: z.record(z.string())
});

const json = zodToMCP(schema);
console.log(JSON.stringify(json, null, 2));
```

### ✅ Output

```json
{
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" },
    "age": { "type": "number", "default": 18 },
    "status": { "type": "string", "enum": ["active", "inactive"] },
    "tags": { "type": "array", "items": { "type": "string" } },
    "metadata": { "type": "object", "additionalProperties": { "type": "string" } }
  },
  "required": ["id", "name", "status", "tags", "metadata"]
}
```

---

## 🔧 CLI Usage

```bash
npx zod-to-mcp-json ./example/schema.ts > schema.json
```

Your `.ts` file must:

* Use ESM module style (`export default`)
* Export a single Zod schema as the default export

Example:

```ts
// example/schema.ts
import { z } from "zod";

export default z.object({
  username: z.string(),
  age: z.number().optional()
});
```

---

## 📘 Supported Zod Types

| Zod Type              | MCP Conversion                 |
| --------------------- | ------------------------------ |
| `z.string()`          | `type: "string"`               |
| `z.number()`          | `type: "number"`               |
| `z.boolean()`         | `type: "boolean"`              |
| `z.literal("x")`      | `enum: ["x"]`                  |
| `z.enum(["a", "b"])`  | `enum: [...]`                  |
| `z.object({...})`     | `type: "object"`               |
| `z.array(z.string())` | `type: "array"`                |
| `z.union([...])`      | `oneOf: [...]`                 |
| `z.optional()`        | handled                        |
| `z.nullable()`        | `anyOf: [..., {type: "null"}]` |
| `z.default(...)`      | `default: ...`                 |
| `z.record()`          | `additionalProperties: ...`    |
| `z.tuple([...])`      | `prefixItems`                  |

---

## 📄 License

MIT License © \[Your Name]

---

## 🙌 Contributing

PRs are welcome! If you'd like to support additional features like:

* Custom error messages
* CLI flags (`--out`, `--pretty`, etc.)
* VS Code integration

Feel free to contribute or open issues.

---

## ⭐️ Give it a Star

If you find this useful, please give it a ⭐️ on [GitHub](https://github.com/devan021/zod-to-mcp-json)!
```
```
