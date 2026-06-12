import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Switch } from "@workspace/ui/components/switch"
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group"
import { TokenReference, type RefGroup } from "../../.storybook/token-reference"

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "Combine labels, controls, and help text to compose accessible form fields and grouped inputs.",
      },
    },
  },
  title: "Components/Field",
  component: Field,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal", "responsive"],
    },
  },
  args: {
    orientation: "vertical",
  },
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="w-80">
      <Field {...args}>
        <FieldLabel htmlFor="name">Full name</FieldLabel>
        <Input id="name" placeholder="Ada Lovelace" />
        <FieldDescription>This is shown on your profile.</FieldDescription>
      </Field>
    </div>
  ),
}

export const Horizontal: Story = {
  args: { orientation: "horizontal" },
  render: (args) => (
    <div className="w-96">
      <Field {...args}>
        <FieldContent>
          <FieldLabel htmlFor="notifications">Push notifications</FieldLabel>
          <FieldDescription>
            Receive alerts about reactor activity.
          </FieldDescription>
        </FieldContent>
        <Switch id="notifications" defaultChecked />
      </Field>
    </div>
  ),
}

export const Invalid: Story = {
  render: (args) => (
    <div className="w-80">
      <Field {...args} data-invalid>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" aria-invalid defaultValue="not-an-email" />
        <FieldError>Please enter a valid email address.</FieldError>
      </Field>
    </div>
  ),
}

export const FieldGroupExample: Story = {
  render: () => (
    <div className="w-80">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="first">First name</FieldLabel>
          <Input id="first" placeholder="Ada" />
        </Field>
        <Field>
          <FieldLabel htmlFor="last">Last name</FieldLabel>
          <Input id="last" placeholder="Lovelace" />
        </Field>
        <FieldSeparator>Optional</FieldSeparator>
        <Field>
          <FieldLabel htmlFor="bio">Bio</FieldLabel>
          <Textarea id="bio" placeholder="Tell us about yourself" />
          <FieldDescription>Markdown is supported.</FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  ),
}

export const WithFieldSet: Story = {
  render: () => (
    <div className="w-80">
      <FieldSet>
        <FieldLegend>Plan</FieldLegend>
        <FieldDescription>Choose the plan that fits you.</FieldDescription>
        <RadioGroup defaultValue="pro">
          <Field orientation="horizontal">
            <RadioGroupItem value="free" id="fs-free" />
            <FieldLabel htmlFor="fs-free">Free</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="pro" id="fs-pro" />
            <FieldLabel htmlFor="fs-pro">Pro</FieldLabel>
          </Field>
        </RadioGroup>
      </FieldSet>
    </div>
  ),
}

export const WithTitle: Story = {
  render: () => (
    <div className="w-80">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle>Two-factor authentication</FieldTitle>
          <FieldDescription>
            Add an extra layer of security to your account.
          </FieldDescription>
        </FieldContent>
        <Switch defaultChecked />
      </Field>
    </div>
  ),
}

const tokenGroups: RefGroup[] = [
  {
    title: "Colors",
    description: "Semantic tokens used by field text, validation, the selected-card tint, and the separator.",
    tokens: [
      {
        cssVar: "--muted-foreground",
        utility: "text-muted-foreground",
        affects: "Field & separator description text",
      },
      {
        cssVar: "--destructive",
        utility: "text-destructive",
        affects: "Invalid field text & error message",
      },
      {
        cssVar: "--primary",
        utility: "has-data-checked:bg-primary/5",
        affects: "Selected choice-card label border & background tint",
      },
      { cssVar: "--border", utility: "has-[…]:border", affects: "Choice-card label & separator border" },
      { cssVar: "--background", utility: "bg-background", affects: "Separator label background" },
      {
        cssVar: "--primary-link",
        utility: "text-primary-link",
        affects: "Inline link hover color in descriptions",
      },
    ],
  },
  {
    title: "Radius",
    tokens: [
      {
        cssVar: "--radius-lg",
        utility: "rounded-lg",
        affects: "Choice-card label corner radius",
        radius: true,
      },
    ],
  },
]

/**
 * Collapsible reference of every CSS custom property that influences the
 * Field's appearance. Swatches and values update live with the active theme.
 */
export const CssVariables: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The design tokens that affect the Field. Swatches and values track the active light/dark theme.",
      },
    },
  },
  render: () => <TokenReference groups={tokenGroups} />,
}
