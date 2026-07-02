"use client"

import { ChevronDownIcon } from "lucide-react"

import { ModelSelectorLogo } from "@/components/ai-elements/model-selector"
import { PromptInputButton } from "@/components/ai-elements/prompt-input"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CHEFS, MODELS } from "@/lib/models"

export type ModelPickerProps = {
  model: string
  onModelChange: (modelId: string) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ModelPicker({
  model,
  onModelChange,
  open,
  onOpenChange,
}: ModelPickerProps) {
  const selectedModel = MODELS.find((m) => m.id === model)

  const handleSelect = (modelId: string) => {
    onModelChange(modelId)
    onOpenChange(false)
  }

  return (
    <Popover onOpenChange={onOpenChange} open={open}>
      <PopoverTrigger asChild>
        <PromptInputButton className="max-w-32 gap-1.5 sm:max-w-none">
          {selectedModel?.chefSlug && (
            <ModelSelectorLogo
              className="size-3.5 shrink-0"
              provider={selectedModel.chefSlug}
            />
          )}
          {selectedModel?.name && (
            <span className="truncate">{selectedModel.name}</span>
          )}
          <ChevronDownIcon className="size-3 shrink-0 opacity-60" />
        </PromptInputButton>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[min(20rem,calc(100vw-2rem))] gap-0 overflow-hidden rounded-2xl p-0"
        side="top"
        sideOffset={10}
      >
        <Command className="rounded-2xl">
          <CommandInput
            className="h-9"
            placeholder="Search models..."
          />
          <CommandList className="max-h-[min(60vh,22rem)]">
            <CommandEmpty>No models found.</CommandEmpty>
            {CHEFS.map((chef) => (
              <CommandGroup heading={chef} key={chef}>
                {MODELS.filter((m) => m.chef === chef).map((m) => {
                  const isSelected = model === m.id
                  return (
                    <CommandItem
                      data-checked={isSelected}
                      key={m.id}
                      onSelect={() => handleSelect(m.id)}
                      value={`${m.name} ${m.id} ${m.chef}`}
                    >
                      <ModelSelectorLogo
                        className="size-4 shrink-0"
                        provider={m.chefSlug}
                      />
                      <span className="min-w-0 flex-1 truncate">
                        {m.name}
                      </span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
