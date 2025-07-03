import { ZodTypeAny } from "zod";
import { z } from "zod";

export function zodToMCP(schema: ZodTypeAny): any {
  const def = schema._def;

  switch (def.typeName) {
    case "ZodString":
      return { type: "string" };

    case "ZodNumber":
      return { type: "number" };

    case "ZodBoolean":
      return { type: "boolean" };

    case "ZodLiteral":
      return {
        type: typeof def.value,
        enum: [def.value]
      };

    case "ZodEnum":
      return {
        type: "string",
        enum: def.values
      };

    case "ZodObject":
      const shape = def.shape();
      const properties: Record<string, any> = {};
      const required: string[] = [];

      for (const key in shape) {
        const child = shape[key];
        properties[key] = zodToMCP(child);
        if (!child.isOptional() && !child._def.typeName.startsWith("ZodOptional")) {
          required.push(key);
        }
      }

      return {
        type: "object",
        properties,
        required
      };

    case "ZodArray":
      return {
        type: "array",
        items: zodToMCP(def.type)
      };

    case "ZodOptional":
      return zodToMCP(def.innerType);

    case "ZodNullable":
      const base = zodToMCP(def.innerType);
      return {
        anyOf: [base, { type: "null" }]
      };

    case "ZodUnion":
      return {
        oneOf: def.options.map(zodToMCP)
      };

    case "ZodDefault":
      const inner = zodToMCP(def.innerType);
      return {
        ...inner,
        default: def.defaultValue()
      };

    case "ZodRecord":
      return {
        type: "object",
        additionalProperties: zodToMCP(def.valueType)
      };

    case "ZodAny":
    case "ZodUnknown":
      return {}; // Accepts anything

    case "ZodEffects":
      return zodToMCP(def.schema); // Strip preprocessing or refinement

    case "ZodTuple":
      return {
        type: "array",
        prefixItems: def.items.map(zodToMCP),
        minItems: def.items.length,
        maxItems: def.items.length
      };

    default:
      return { type: "unknown", note: `Unrecognized type: ${def.typeName}` };
  }
}

// Test example (can be removed in prod build)
const exampleSchema = z.object({
  id: z.string().describe("Unique ID"),
  age: z.number().default(18),
  isAdmin: z.boolean().optional(),
  tags: z.array(z.string()),
  status: z.union([z.literal("active"), z.literal("inactive")]),
  meta: z.record(z.string()),
  tupleExample: z.tuple([z.string(), z.number()]),
  name: z.string().nullable(),
});

console.log(JSON.stringify(zodToMCP(exampleSchema), null, 2));
