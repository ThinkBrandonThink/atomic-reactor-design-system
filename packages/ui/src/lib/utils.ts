import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Teach tailwind-merge that our composite typography roles (defined in
// semantic.css) are font-size utilities. Without this it buckets `text-label`,
// `text-body`, etc. with text-color and drops them whenever a variant also sets
// a color — and they fail to override raw `text-sm`/`text-base` sizes.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "heading-lg",
            "heading-md",
            "heading-sm",
            "body",
            "body-sm",
            "label",
            "label-sm",
            "caption",
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
