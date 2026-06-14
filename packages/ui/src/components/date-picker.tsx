"use client"

import * as React from "react"
import { format, isValid, parse } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { Calendar } from "@workspace/ui/components/calendar"
import { Input } from "@workspace/ui/components/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"

// Digit count for each supported numeric `date-fns` token.
const NUMERIC_TOKEN_LENGTHS: Record<string, number> = {
  yyyy: 4,
  yy: 2,
  MM: 2,
  dd: 2,
  HH: 2,
  hh: 2,
  mm: 2,
  ss: 2,
}

type NumericMask = { groups: number[]; separators: string[] }

/**
 * Derive a numeric mask from a format string, e.g. `"MM/dd/yyyy"` →
 * `{ groups: [2, 2, 4], separators: ["/", "/"] }`. Returns `null` when the
 * format contains a non-numeric token (e.g. `"PPP"`), in which case no masking
 * is applied.
 */
function getNumericMask(formatStr: string): NumericMask | null {
  const groups: number[] = []
  const separators: string[] = []
  let pendingSep = ""
  for (let i = 0; i < formatStr.length; i++) {
    const ch = formatStr[i]
    if (/[a-zA-Z]/.test(ch)) {
      let token = ch
      while (formatStr[i + 1] === ch) {
        token += ch
        i++
      }
      const len = NUMERIC_TOKEN_LENGTHS[token]
      if (!len) return null
      if (groups.length) separators.push(pendingSep)
      groups.push(len)
      pendingSep = ""
    } else {
      pendingSep += ch
    }
  }
  return { groups, separators }
}

/** Re-insert separators into typed digits, capping length to the mask. */
function applyMask(raw: string, mask: NumericMask): string {
  const digits = raw.replace(/\D/g, "")
  let out = ""
  let pos = 0
  for (let g = 0; g < mask.groups.length && pos < digits.length; g++) {
    if (g > 0) out += mask.separators[g - 1]
    out += digits.slice(pos, pos + mask.groups[g])
    pos += mask.groups[g]
  }
  return out
}

type DatePickerProps = {
  /** Controlled selected date. */
  value?: Date
  /** Initial date when uncontrolled. */
  defaultValue?: Date
  onValueChange?: (date: Date | undefined) => void
  placeholder?: string
  /** `date-fns` format string used for the input display and typed-date parsing. */
  formatStr?: string
  disabled?: boolean
  /** Extra classes for the wrapper. */
  className?: string
  align?: React.ComponentProps<typeof PopoverContent>["align"]
}

function DatePicker({
  value,
  defaultValue,
  onValueChange,
  placeholder = "MM/DD/YYYY",
  formatStr = "MM/dd/yyyy",
  disabled,
  className,
  align = "end",
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    defaultValue
  )
  const isControlled = value !== undefined
  const date = isControlled ? value : internalDate

  const mask = React.useMemo(() => getNumericMask(formatStr), [formatStr])

  const [inputValue, setInputValue] = React.useState(
    date ? format(date, formatStr) : ""
  )
  const [invalid, setInvalid] = React.useState(false)

  // Reflect the canonical date back into the input text whenever it changes
  // from somewhere other than typing (calendar selection, controlled updates,
  // a new format) by adjusting state during render. Typing alone only moves
  // `inputValue`, so this doesn't fight the user mid-edit.
  const [synced, setSynced] = React.useState({ date, formatStr })
  if (synced.date !== date || synced.formatStr !== formatStr) {
    setSynced({ date, formatStr })
    setInputValue(date ? format(date, formatStr) : "")
    setInvalid(false)
  }

  const setDate = (next: Date | undefined) => {
    if (!isControlled) setInternalDate(next)
    onValueChange?.(next)
  }

  const handleSelect = (next: Date | undefined) => {
    setDate(next)
    setOpen(false)
  }

  const commitTypedValue = () => {
    const text = inputValue.trim()
    if (text === "") {
      setInvalid(false)
      setDate(undefined)
      return
    }
    const parsed = parse(text, formatStr, new Date())
    if (isValid(parsed)) {
      setInvalid(false)
      setDate(parsed)
    } else {
      setInvalid(true)
    }
  }

  return (
    <div className={cn("relative w-56", className)} data-slot="date-picker">
      <Input
        data-slot="date-picker-input"
        value={inputValue}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className="pr-8"
        onChange={(event) =>
          setInputValue(
            mask ? applyMask(event.target.value, mask) : event.target.value
          )
        }
        onBlur={commitTypedValue}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault()
            commitTypedValue()
          }
        }}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              disabled={disabled}
              data-slot="date-picker-trigger"
              aria-label="Open calendar"
              className="absolute top-1/2 right-0.5 size-7 -translate-y-1/2 text-muted-foreground"
            >
              <CalendarIcon />
            </Button>
          }
        />
        <PopoverContent
          data-slot="date-picker-content"
          align={align}
          className="w-auto p-0"
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export { DatePicker }
export type { DatePickerProps }
