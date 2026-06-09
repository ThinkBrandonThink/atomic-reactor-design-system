import { useState } from "react"
import { toast } from "sonner"
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  SearchIcon,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  CreditCardIcon,
  PlusIcon,
  FilesIcon,
  FolderIcon,
  TrashIcon,
  Edit2Icon,
  CopyIcon,
} from "lucide-react"

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@workspace/ui/components/accordion"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@workspace/ui/components/alert-dialog"
import { Alert, AlertTitle, AlertDescription } from "@workspace/ui/components/alert"
import { AspectRatio } from "@workspace/ui/components/aspect-ratio"
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@workspace/ui/components/breadcrumb"
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@workspace/ui/components/button-group"
import { Button } from "@workspace/ui/components/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from "@workspace/ui/components/card"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@workspace/ui/components/carousel"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@workspace/ui/components/collapsible"
import { Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem, ComboboxEmpty } from "@workspace/ui/components/combobox"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from "@workspace/ui/components/command"
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuLabel } from "@workspace/ui/components/context-menu"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@workspace/ui/components/dialog"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@workspace/ui/components/drawer"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut } from "@workspace/ui/components/dropdown-menu"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@workspace/ui/components/empty"
import { Field, FieldLabel, FieldDescription, FieldGroup } from "@workspace/ui/components/field"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@workspace/ui/components/hover-card"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@workspace/ui/components/input-group"
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@workspace/ui/components/input-otp"
import { Input } from "@workspace/ui/components/input"
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemGroup, ItemActions } from "@workspace/ui/components/item"
import { Kbd, KbdGroup } from "@workspace/ui/components/kbd"
import { Label } from "@workspace/ui/components/label"
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarShortcut } from "@workspace/ui/components/menubar"
import { NativeSelect, NativeSelectOption, NativeSelectOptGroup } from "@workspace/ui/components/native-select"
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from "@workspace/ui/components/navigation-menu"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "@workspace/ui/components/pagination"
import { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverTitle, PopoverDescription } from "@workspace/ui/components/popover"
import { Progress } from "@workspace/ui/components/progress"
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@workspace/ui/components/resizable"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel } from "@workspace/ui/components/select"
import { Separator } from "@workspace/ui/components/separator"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@workspace/ui/components/sheet"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Slider } from "@workspace/ui/components/slider"
import { Spinner } from "@workspace/ui/components/spinner"
import { Switch } from "@workspace/ui/components/switch"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell, TableCaption } from "@workspace/ui/components/table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@workspace/ui/components/tabs"
import { Textarea } from "@workspace/ui/components/textarea"
import { Toggle } from "@workspace/ui/components/toggle"
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@workspace/ui/components/tooltip"
import { Toaster } from "@workspace/ui/components/sonner"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</h2>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </section>
  )
}

const fruits = ["Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig", "Grape"]

export function App() {
  const [checked, setChecked] = useState(false)
  const [switched, setSwitched] = useState(false)
  const [radio, setRadio] = useState("option-1")
  const [sliderValue, setSliderValue] = useState([40])
  const [comboValue, setComboValue] = useState("")
  const [otpValue, setOtpValue] = useState("")

  return (
    <TooltipProvider>
      <Toaster />
      <div className="min-h-svh p-8">
        <div className="mx-auto max-w-4xl space-y-10">
          <div>
            <h1 className="text-2xl font-semibold">Component Showcase</h1>
            <p className="text-sm text-muted-foreground mt-1">All components from @workspace/ui</p>
          </div>

          {/* ── Buttons ── */}
          <Section title="Button — variants">
            <Button>Default</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </Section>

          <Section title="Button — sizes">
            <Button size="xs">Extra small</Button>
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon"><PlusIcon /></Button>
            <Button size="icon-sm"><PlusIcon /></Button>
            <Button size="icon-xs"><PlusIcon /></Button>
            <Button disabled>Disabled</Button>
          </Section>

          {/* ── ButtonGroup ── */}
          <Section title="ButtonGroup">
            <ButtonGroup>
              <Button variant="outline">Left</Button>
              <Button variant="outline">Center</Button>
              <Button variant="outline">Right</Button>
            </ButtonGroup>
            <ButtonGroup>
              <ButtonGroupText>$</ButtonGroupText>
              <Input placeholder="Amount" className="w-28" />
            </ButtonGroup>
          </Section>

          {/* ── Badge ── */}
          <Section title="Badge">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </Section>

          {/* ── Spinner / Skeleton ── */}
          <Section title="Spinner">
            <Spinner className="size-4" />
            <Spinner className="size-6" />
            <Spinner className="size-8" />
          </Section>

          <Section title="Skeleton">
            <div className="flex flex-col gap-2 w-48">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </Section>

          {/* ── Label / Kbd / Separator ── */}
          <Section title="Label">
            <Label>Form Label</Label>
            <Label>
              <Checkbox /> Accept terms
            </Label>
          </Section>

          <Section title="Kbd">
            <KbdGroup>
              <Kbd>⌘</Kbd><Kbd>K</Kbd>
            </KbdGroup>
            <Kbd>Enter</Kbd>
            <Kbd>Escape</Kbd>
            <KbdGroup>
              <Kbd>Ctrl</Kbd><Kbd>Shift</Kbd><Kbd>P</Kbd>
            </KbdGroup>
          </Section>

          <Section title="Separator">
            <div className="w-64 space-y-2">
              <p className="text-sm">Above</p>
              <Separator />
              <p className="text-sm">Below</p>
            </div>
            <div className="flex h-8 items-center gap-2 text-sm">
              <span>Left</span>
              <Separator orientation="vertical" />
              <span>Right</span>
            </div>
          </Section>

          {/* ── Input / Textarea ── */}
          <Section title="Input">
            <Input placeholder="Default input" className="w-56" />
            <Input placeholder="Disabled" disabled className="w-56" />
            <Input type="password" placeholder="Password" className="w-56" />
          </Section>

          <Section title="Textarea">
            <Textarea placeholder="Write something..." className="w-56" rows={3} />
          </Section>

          {/* ── InputGroup ── */}
          <Section title="InputGroup">
            <InputGroup className="w-56">
              <InputGroupAddon align="inline-start">
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput placeholder="Search..." />
            </InputGroup>
            <InputGroup className="w-40">
              <InputGroupInput placeholder="Amount" />
              <InputGroupAddon align="inline-end">
                <InputGroupText>USD</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Section>

          {/* ── InputOTP ── */}
          <Section title="InputOTP">
            <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </Section>

          {/* ── Form Controls ── */}
          <Section title="Checkbox">
            <div className="flex items-center gap-2">
              <Checkbox id="cb1" checked={checked} onCheckedChange={(v) => setChecked(v === true)} />
              <Label htmlFor="cb1">Accept terms and conditions</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="cb2" disabled />
              <Label htmlFor="cb2">Disabled</Label>
            </div>
          </Section>

          <Section title="Switch">
            <div className="flex items-center gap-2">
              <Switch id="sw1" checked={switched} onCheckedChange={setSwitched} />
              <Label htmlFor="sw1">{switched ? "On" : "Off"}</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="sw2" size="sm" />
              <Label htmlFor="sw2">Small</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="sw3" disabled />
              <Label htmlFor="sw3">Disabled</Label>
            </div>
          </Section>

          <Section title="RadioGroup">
            <RadioGroup value={radio} onValueChange={setRadio} className="gap-2">
              {["option-1", "option-2", "option-3"].map((v) => (
                <div key={v} className="flex items-center gap-2">
                  <RadioGroupItem value={v} id={v} />
                  <Label htmlFor={v}>{v}</Label>
                </div>
              ))}
            </RadioGroup>
          </Section>

          <Section title="Slider">
            <div className="w-56 space-y-1">
              <Slider value={sliderValue} onValueChange={setSliderValue} />
              <p className="text-xs text-muted-foreground">Value: {sliderValue[0]}</p>
            </div>
            <div className="w-56">
              <Slider defaultValue={[20, 70]} />
            </div>
          </Section>

          {/* ── Select / NativeSelect ── */}
          <Section title="Select">
            <Select>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Pick a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  {fruits.map((f) => (
                    <SelectItem key={f} value={f.toLowerCase()}>{f}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Section>

          <Section title="NativeSelect">
            <NativeSelect>
              <NativeSelectOptGroup label="Fruits">
                {fruits.map((f) => (
                  <NativeSelectOption key={f} value={f.toLowerCase()}>{f}</NativeSelectOption>
                ))}
              </NativeSelectOptGroup>
            </NativeSelect>
          </Section>

          {/* ── Combobox ── */}
          <Section title="Combobox">
            <Combobox value={comboValue} onValueChange={setComboValue}>
              <ComboboxInput placeholder="Search fruit..." className="w-48" />
              <ComboboxContent>
                <ComboboxList>
                  <ComboboxEmpty>No fruit found.</ComboboxEmpty>
                  {fruits.map((f) => (
                    <ComboboxItem key={f} value={f.toLowerCase()}>{f}</ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Section>

          {/* ── Field ── */}
          <Section title="Field">
            <FieldGroup className="w-72">
              <Field>
                <FieldLabel>Email address</FieldLabel>
                <Input type="email" placeholder="you@example.com" />
                <FieldDescription>We'll never share your email.</FieldDescription>
              </Field>
              <Field>
                <FieldLabel>Message</FieldLabel>
                <Textarea placeholder="Your message..." rows={3} />
              </Field>
            </FieldGroup>
          </Section>

          {/* ── Alert ── */}
          <Section title="Alert">
            <Alert className="w-80">
              <AlertTitle>Default alert</AlertTitle>
              <AlertDescription>This is a default alert description.</AlertDescription>
            </Alert>
            <Alert variant="destructive" className="w-80">
              <AlertTitle>Destructive alert</AlertTitle>
              <AlertDescription>Something went wrong. Please try again.</AlertDescription>
            </Alert>
          </Section>

          {/* ── Avatar ── */}
          <Section title="Avatar">
            <Avatar size="sm">
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar size="lg">
              <AvatarFallback>LG</AvatarFallback>
            </Avatar>
            <AvatarGroup>
              {["AB", "CD", "EF"].map((initials) => (
                <Avatar key={initials}>
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              ))}
              <AvatarGroupCount>+3</AvatarGroupCount>
            </AvatarGroup>
          </Section>

          {/* ── Progress ── */}
          <Section title="Progress">
            <div className="w-64 space-y-2">
              <Progress value={33} />
              <Progress value={66} />
              <Progress value={100} />
            </div>
          </Section>

          {/* ── Tabs ── */}
          <Section title="Tabs">
            <Tabs defaultValue="tab1" className="w-80">
              <TabsList>
                <TabsTrigger value="tab1">Account</TabsTrigger>
                <TabsTrigger value="tab2">Password</TabsTrigger>
                <TabsTrigger value="tab3">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1" className="pt-2">
                <p className="text-sm text-muted-foreground">Manage your account details here.</p>
              </TabsContent>
              <TabsContent value="tab2" className="pt-2">
                <p className="text-sm text-muted-foreground">Change your password here.</p>
              </TabsContent>
              <TabsContent value="tab3" className="pt-2">
                <p className="text-sm text-muted-foreground">Configure your settings here.</p>
              </TabsContent>
            </Tabs>
          </Section>

          {/* ── Accordion ── */}
          <Section title="Accordion">
            <Accordion className="w-80">
              {[
                { value: "a", trigger: "What is this?", content: "This is an accordion component for showing collapsible content." },
                { value: "b", trigger: "Is it accessible?", content: "Yes, it follows WAI-ARIA guidelines for accessible accordions." },
                { value: "c", trigger: "Can I style it?", content: "Absolutely, use className to apply custom styles." },
              ].map(({ value, trigger, content }) => (
                <AccordionItem key={value} value={value}>
                  <AccordionTrigger>{trigger}</AccordionTrigger>
                  <AccordionContent>{content}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Section>

          {/* ── Collapsible ── */}
          <Section title="Collapsible">
            <Collapsible className="w-64">
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Show details <span className="text-xs text-muted-foreground">toggle</span>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="rounded-lg border mt-2 p-3 text-sm text-muted-foreground">
                  Hidden content revealed on toggle.
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Section>

          {/* ── Card ── */}
          <Section title="Card">
            <Card className="w-72">
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>A short description of the card content.</CardDescription>
                <CardAction>
                  <Badge variant="secondary">New</Badge>
                </CardAction>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Card body content goes here. It can contain any elements.</p>
              </CardContent>
              <CardFooter className="justify-end gap-2">
                <Button variant="outline" size="sm">Cancel</Button>
                <Button size="sm">Save</Button>
              </CardFooter>
            </Card>
            <Card className="w-56" size="sm">
              <CardHeader>
                <CardTitle>Small card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Compact size variant.</p>
              </CardContent>
            </Card>
          </Section>

          {/* ── Table ── */}
          <Section title="Table">
            <Table className="w-[500px]">
              <TableCaption>A list of recent transactions.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-end">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { name: "Alice Johnson", status: "Success", method: "Visa", amount: "$250.00" },
                  { name: "Bob Smith", status: "Pending", method: "Paypal", amount: "$150.00" },
                  { name: "Carol White", status: "Failed", method: "Mastercard", amount: "$350.00" },
                ].map((row) => (
                  <TableRow key={row.name}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.method}</TableCell>
                    <TableCell className="text-end">{row.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Section>

          {/* ── Item ── */}
          <Section title="Item">
            <ItemGroup className="w-72">
              {[
                { title: "Design system", desc: "Atomic Reactor components" },
                { title: "Documentation", desc: "Guides and API references" },
                { title: "Templates", desc: "Starter project templates" },
              ].map(({ title, desc }) => (
                <Item key={title} variant="outline">
                  <ItemMedia variant="icon"><FilesIcon /></ItemMedia>
                  <ItemContent>
                    <ItemTitle>{title}</ItemTitle>
                    <ItemDescription>{desc}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Button variant="ghost" size="icon-sm"><Edit2Icon /></Button>
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          </Section>

          {/* ── Empty ── */}
          <Section title="Empty">
            <Empty className="w-64 border">
              <EmptyHeader>
                <EmptyMedia variant="icon"><FolderIcon /></EmptyMedia>
                <EmptyTitle>No files found</EmptyTitle>
                <EmptyDescription>Upload a file to get started.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button size="sm"><PlusIcon /> Upload file</Button>
              </EmptyContent>
            </Empty>
          </Section>

          {/* ── ScrollArea ── */}
          <Section title="ScrollArea">
            <ScrollArea className="h-32 w-48 rounded-lg border p-2">
              {Array.from({ length: 20 }, (_, i) => (
                <p key={i} className="text-sm py-0.5">Item {i + 1}</p>
              ))}
            </ScrollArea>
          </Section>

          {/* ── ResizablePanelGroup ── */}
          <Section title="Resizable">
            <ResizablePanelGroup direction="horizontal" className="w-80 h-24 rounded-lg border">
              <ResizablePanel defaultSize={50}>
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Left</div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={50}>
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Right</div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </Section>

          {/* ── AspectRatio ── */}
          <Section title="AspectRatio">
            <AspectRatio ratio={16 / 9} className="w-48 rounded-lg bg-muted overflow-hidden">
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">16:9</div>
            </AspectRatio>
            <AspectRatio ratio={1} className="w-24 rounded-lg bg-muted overflow-hidden">
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">1:1</div>
            </AspectRatio>
          </Section>

          {/* ── Carousel ── */}
          <Section title="Carousel">
            <Carousel className="w-64">
              <CarouselContent>
                {["Slide 1", "Slide 2", "Slide 3"].map((slide) => (
                  <CarouselItem key={slide}>
                    <div className="flex h-20 items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">{slide}</div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </Section>

          {/* ── Breadcrumb ── */}
          <Section title="Breadcrumb">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink href="#">Components</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </Section>

          {/* ── Pagination ── */}
          <Section title="Pagination">
            <Pagination className="justify-start">
              <PaginationContent>
                <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
                <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
                <PaginationItem><PaginationEllipsis /></PaginationItem>
                <PaginationItem><PaginationNext href="#" /></PaginationItem>
              </PaginationContent>
            </Pagination>
          </Section>

          {/* ── NavigationMenu ── */}
          <Section title="NavigationMenu">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-1 p-2 w-48">
                      <NavigationMenuLink href="#">Introduction</NavigationMenuLink>
                      <NavigationMenuLink href="#">Installation</NavigationMenuLink>
                      <NavigationMenuLink href="#">Typography</NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-1 p-2 w-48">
                      <NavigationMenuLink href="#">Button</NavigationMenuLink>
                      <NavigationMenuLink href="#">Input</NavigationMenuLink>
                      <NavigationMenuLink href="#">Dialog</NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </Section>

          {/* ── Menubar ── */}
          <Section title="Menubar">
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>New file <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
                  <MenubarItem>Open <MenubarShortcut>⌘O</MenubarShortcut></MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Save <MenubarShortcut>⌘S</MenubarShortcut></MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>Edit</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
                  <MenubarItem>Redo <MenubarShortcut>⌘Y</MenubarShortcut></MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Cut</MenubarItem>
                  <MenubarItem>Copy</MenubarItem>
                  <MenubarItem>Paste</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>View</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>Zoom in</MenubarItem>
                  <MenubarItem>Zoom out</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </Section>

          {/* ── DropdownMenu ── */}
          <Section title="DropdownMenu">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Open menu</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><UserIcon /> Profile</DropdownMenuItem>
                <DropdownMenuItem><CreditCardIcon /> Billing</DropdownMenuItem>
                <DropdownMenuItem><SettingsIcon /> Settings<DropdownMenuShortcut>⌘,</DropdownMenuShortcut></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive"><LogOutIcon /> Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Section>

          {/* ── ContextMenu ── */}
          <Section title="ContextMenu">
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <div className="flex h-20 w-56 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground cursor-context-menu">
                  Right-click here
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuLabel>Actions</ContextMenuLabel>
                <ContextMenuSeparator />
                <ContextMenuItem><CopyIcon /> Copy</ContextMenuItem>
                <ContextMenuItem><Edit2Icon /> Edit</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem variant="destructive"><TrashIcon /> Delete</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </Section>

          {/* ── Command ── */}
          <Section title="Command">
            <div className="w-72 rounded-lg border shadow-sm overflow-hidden">
              <Command>
                <CommandInput placeholder="Search commands..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Suggestions">
                    <CommandItem><SearchIcon /> Search</CommandItem>
                    <CommandItem><UserIcon /> Profile</CommandItem>
                    <CommandItem><SettingsIcon /> Settings</CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup heading="Actions">
                    <CommandItem><PlusIcon /> New file</CommandItem>
                    <CommandItem><CopyIcon /> Copy link</CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          </Section>

          {/* ── Dialog ── */}
          <Section title="Dialog">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>Make changes to your profile here. Click save when done.</DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <Field><FieldLabel>Name</FieldLabel><Input placeholder="Your name" /></Field>
                  <Field><FieldLabel>Username</FieldLabel><Input placeholder="@username" /></Field>
                </div>
                <DialogFooter showCloseButton>
                  <Button>Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Section>

          {/* ── AlertDialog ── */}
          <Section title="AlertDialog">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove all data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Section>

          {/* ── Sheet ── */}
          <Section title="Sheet">
            {(["right", "left", "top", "bottom"] as const).map((side) => (
              <Sheet key={side}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">{side}</Button>
                </SheetTrigger>
                <SheetContent side={side}>
                  <SheetHeader>
                    <SheetTitle>Sheet — {side}</SheetTitle>
                    <SheetDescription>This sheet slides in from the {side}.</SheetDescription>
                  </SheetHeader>
                  <SheetFooter>
                    <Button size="sm">Save</Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            ))}
          </Section>

          {/* ── Drawer ── */}
          <Section title="Drawer">
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline">Open drawer</Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Drawer title</DrawerTitle>
                  <DrawerDescription>This is a drawer component using vaul.</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <Button>Submit</Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </Section>

          {/* ── Popover ── */}
          <Section title="Popover">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Open popover</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverHeader>
                  <PopoverTitle>Popover title</PopoverTitle>
                  <PopoverDescription>This is a floating popover element.</PopoverDescription>
                </PopoverHeader>
                <div className="pt-1 text-sm text-muted-foreground">Any content can go here.</div>
              </PopoverContent>
            </Popover>
          </Section>

          {/* ── HoverCard ── */}
          <Section title="HoverCard">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link">@workspace/ui</Button>
              </HoverCardTrigger>
              <HoverCardContent>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Atomic Reactor UI</p>
                  <p className="text-xs text-muted-foreground">
                    A collection of accessible, composable components built on Base UI.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </Section>

          {/* ── Tooltip ── */}
          <Section title="Tooltip">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon"><PlusIcon /></Button>
              </TooltipTrigger>
              <TooltipContent>Add item</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>
                Tooltip with <Kbd>⌘K</Kbd>
              </TooltipContent>
            </Tooltip>
          </Section>

          {/* ── Toggle / ToggleGroup ── */}
          <Section title="Toggle">
            <Toggle><BoldIcon />Bold</Toggle>
            <Toggle variant="outline"><ItalicIcon />Italic</Toggle>
            <Toggle><UnderlineIcon />Underline</Toggle>
          </Section>

          <Section title="ToggleGroup">
            <ToggleGroup type="multiple">
              <ToggleGroupItem value="bold"><BoldIcon /></ToggleGroupItem>
              <ToggleGroupItem value="italic"><ItalicIcon /></ToggleGroupItem>
              <ToggleGroupItem value="underline"><UnderlineIcon /></ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup type="single" variant="outline" spacing={0}>
              <ToggleGroupItem value="left">Left</ToggleGroupItem>
              <ToggleGroupItem value="center">Center</ToggleGroupItem>
              <ToggleGroupItem value="right">Right</ToggleGroupItem>
            </ToggleGroup>
          </Section>

          {/* ── Sonner / Toast ── */}
          <Section title="Sonner (Toast)">
            <Button variant="outline" onClick={() => toast("Event has been created")}>Default toast</Button>
            <Button variant="outline" onClick={() => toast.success("Profile updated successfully")}>Success</Button>
            <Button variant="outline" onClick={() => toast.error("Something went wrong")}>Error</Button>
            <Button variant="outline" onClick={() => toast.warning("Please review your input")}>Warning</Button>
            <Button variant="outline" onClick={() => toast.info("New version available")}>Info</Button>
            <Button variant="outline" onClick={() => toast.loading("Saving changes...")}>Loading</Button>
          </Section>
        </div>
      </div>
    </TooltipProvider>
  )
}
