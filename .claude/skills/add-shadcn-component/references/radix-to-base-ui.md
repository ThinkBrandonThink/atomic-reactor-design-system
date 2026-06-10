# Radix → Base UI translation

`shadcn add` emits Radix (`@radix-ui/react-*`). This repo uses Base UI
(`@base-ui/react`). The two libraries solve the same problems with different
shapes. This file is the lookup for converting the generated file. When in doubt,
the existing component that's closest to yours is the authoritative example —
this table just speeds up the common cases.

## Contents
- [Imports & namespacing](#imports--namespacing)
- [Part-name mapping](#part-name-mapping)
- [Context-scoped parts (`GroupLabel`)](#context-scoped-parts-grouplabel)
- [`asChild` → `render` / `useRender`](#aschild--render--userender)
- [Overlays: Portal → Positioner → Popup](#overlays-portal--positioner--popup)
- [Data attributes](#data-attributes)
- [Typing props](#typing-props)
- ["use client"](#use-client)

## Imports & namespacing

Radix imports one package per primitive and usually aliases the whole namespace.
Base UI exports a single namespace per primitive from `@base-ui/react/<name>`,
and you read sub-parts off it (`.Root`, `.Trigger`, `.Popup`, …).

```ts
// Radix (generated — replace this)
import * as TabsPrimitive from "@radix-ui/react-tabs"

// Base UI (use this)
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
```

The wrapper component names you export stay the same as shadcn's (so consumer code
and the showcase don't change) — only the primitive underneath changes. e.g. you
still export `TabsContent`, but it renders `TabsPrimitive.Panel`.

## Part-name mapping

Base UI renames several parts. Common ones (confirm against the primitive's parts
in node_modules or the neighbor component):

| Radix part | Base UI part | Seen in |
|---|---|---|
| `Content` (accordion/collapsible) | `Panel` | `accordion.tsx` |
| `Content` (tabs) | `Panel` | `tabs.tsx` |
| `Trigger` (tabs) | `Tab` | `tabs.tsx` |
| `Content` (popover/tooltip/menu/select) | `Popup` (inside `Portal`>`Positioner`) | `tooltip.tsx`, `select.tsx` |
| `Portal` + inline positioning | `Portal` → `Positioner` → `Popup` | `tooltip.tsx`, `select.tsx` |
| `Viewport` (select) | `List` | `select.tsx` |
| `ScrollUpButton` / `ScrollDownButton` | `ScrollUpArrow` / `ScrollDownArrow` | `select.tsx` |
| `Label` (select/menu group) | `GroupLabel` (requires a `Group` ancestor — see [below](#context-scoped-parts-grouplabel)) | `select.tsx` |
| `Indicator` (checkbox/radio) | `Indicator` (same) | `checkbox.tsx` |
| `ItemIndicator` (select/menu) | `ItemIndicator` (same) | `select.tsx` |

`Header` wrappers (e.g. `AccordionPrimitive.Header` around the trigger) still
exist in Base UI — keep them.

## Context-scoped parts (`GroupLabel`)

Some Base UI parts read a React context that only exists inside a specific
parent, and **throw at render** if that parent is missing. The common one is
`GroupLabel` (menu, select): it must be a descendant of a `Group` or
`RadioGroup`. This differs from Radix, where the equivalent `Label` is
standalone and renders anywhere inside the content.

In this repo, `DropdownMenuLabel`, `MenuLabel`, `ContextMenuLabel`,
`SelectLabel`, etc. all render `…Primitive.GroupLabel`. So a label placed
directly inside the content popup:

```tsx
// ✗ throws: "Base UI: MenuGroupContext is missing. Menu group parts must be
//   used within <Menu.Group> or <Menu.RadioGroup>."
<DropdownMenuContent>
  <DropdownMenuLabel>My Account</DropdownMenuLabel>
  <DropdownMenuItem>…</DropdownMenuItem>
</DropdownMenuContent>

// ✓ wrap the label (and its items) in a Group — or, for a radio menu, put the
//   label inside the RadioGroup. Mirror context-menu.stories.tsx.
<DropdownMenuContent>
  <DropdownMenuGroup>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuItem>…</DropdownMenuItem>
  </DropdownMenuGroup>
</DropdownMenuContent>
```

The error boundary swallows the throw, so the symptom is a blank/non-opening
component rather than a build error — `tsc` and `eslint` pass. **Render it in
Storybook (or the showcase) and open it** before considering a menu/select done;
this class of bug only shows up at runtime. When writing the `.stories.tsx`,
copy the group/label nesting from the closest working story.

## `asChild` → `render` / `useRender`

Radix uses `asChild` + `<Slot>` for polymorphism. Base UI uses a **`render`
prop** instead.

- **On a sub-part**, pass an element to `render`:
  ```tsx
  // Radix: <Select.Icon asChild><ChevronDownIcon/></Select.Icon>
  <SelectPrimitive.Icon render={<ChevronDownIcon className="size-4 …" />} />
  ```
  When you need to keep children *and* customize the wrapper element (e.g. the
  select item indicator), put the wrapper in `render` and the icon as children —
  see `SelectItem` in `select.tsx`.

- **For a top-level polymorphic component** (one that should accept its own
  `render` so callers can swap the tag, like `Badge` rendering as `<a>`), use the
  `useRender` + `mergeProps` pattern from `badge.tsx`:
  ```tsx
  import { mergeProps } from "@base-ui/react/merge-props"
  import { useRender } from "@base-ui/react/use-render"

  function Badge({ className, variant = "default", render, ...props }:
    useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
    return useRender({
      defaultTagName: "span",
      props: mergeProps<"span">({ className: cn(badgeVariants({ variant }), className) }, props),
      render,
      state: { slot: "badge", variant },
    })
  }
  ```
  Note `state.slot` here replaces a literal `data-slot` attribute — Base UI emits
  it for you. Most components just set `data-slot="…"` directly on the primitive;
  only reach for `useRender` when the component itself needs to be polymorphic.

## Overlays: Portal → Positioner → Popup

Any floating component (tooltip, popover, dropdown, menu, select, hover-card)
follows the same three-layer structure in Base UI. Radix collapses positioning
into `Content`; Base UI splits it:

```tsx
<XPrimitive.Portal>
  <XPrimitive.Positioner side={side} sideOffset={sideOffset} align={align}
    alignOffset={alignOffset} className="isolate z-50">
    <XPrimitive.Popup data-slot="x-content" className={cn("… animations …", className)}>
      {children}
      {/* optional: <XPrimitive.Arrow … /> */}
    </XPrimitive.Popup>
  </XPrimitive.Positioner>
</XPrimitive.Portal>
```

Positioning props (`side`, `sideOffset`, `align`, `alignOffset`, and select-only
`alignItemWithTrigger`) live on **`Positioner`**, not `Popup`. The convention in
this repo is to give the content wrapper defaults and forward those props onto
the Positioner while spreading the rest onto the Popup — type it with
`XPrimitive.Popup.Props & Pick<XPrimitive.Positioner.Props, "align" | …>`. Copy
the exact pattern from `tooltip.tsx` (simple) or `select.tsx` (full, with scroll
arrows and `List`).

## Data attributes

Radix state attributes become Base UI ones. Update every selector in the class
strings:

| Radix | Base UI |
|---|---|
| `data-[state=open]` | `data-open` |
| `data-[state=closed]` | `data-closed` |
| `data-[state=checked]` | `data-checked` |
| `data-[state=unchecked]` | `data-unchecked` |
| `data-[state=active]` | `data-active` |
| `data-[disabled]` | `data-disabled` |
| `data-[highlighted]` | `focus:` / `data-highlighted` (check primitive) |
| (enter/exit animations) | `data-starting-style` / `data-ending-style` |
| `data-[side=…]` | `data-[side=…]` (same; note Base UI adds logical `inline-start`/`inline-end`) |

Base UI also exposes `data-placeholder` (select), `data-[align-trigger=…]` etc.
The animation idiom in this repo pairs `tw-animate-css` utilities with these:
`data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95
data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95` — see
`tooltip.tsx`/`select.tsx`.

## Typing props

Prefer the primitive's own exported `Props` types over `React.ComponentProps`:

```tsx
function Accordion(props: AccordionPrimitive.Root.Props) { … }
function AccordionItem(props: AccordionPrimitive.Item.Props) { … }
```

Add variant props by intersecting with CVA's: `XPrimitive.Root.Props &
VariantProps<typeof xVariants>`. For a custom prop (like `size` on
`SelectTrigger`) intersect a small inline type. When a part has no exported
`.Props` type, fall back to `React.ComponentProps<typeof XPrimitive.Part>` (see
the select scroll arrows).

## "use client"

Some components start with `"use client"` (`checkbox.tsx`, `select.tsx`), others
don't (`button.tsx`, `tooltip.tsx`, `accordion.tsx`). Match the neighbor you're
mirroring. The dev app is Vite (not RSC), so it's not load-bearing here, but keep
it where shadcn/the sibling components keep it so the files stay consistent and
the library is safe to consume from a server-component app later.
