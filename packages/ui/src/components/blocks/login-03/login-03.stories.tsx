import type { Meta, StoryObj } from "@storybook/react-vite"

import { LoginBlock03 } from "./login-03"

/**
 * A centered login card on a muted background, composed from the design system's
 * Card, Field, Input, and Button components. Adapted from shadcn's `login-03`
 * block to Base UI + the Atomic Reactor tokens.
 *
 * Offers social login (Apple / Google) above an email + password form, with a
 * separator, "forgot password" link, and terms-of-service footnote.
 */
const meta = {
  title: "Blocks/Login 03",
  component: LoginBlock03,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A centered login card on a muted background, with social login buttons, an email + password form, and a terms-of-service footnote.",
      },
    },
  },
} satisfies Meta<typeof LoginBlock03>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
