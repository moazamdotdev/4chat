"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion, type Variants } from "motion/react"
import { GlobeIcon } from "lucide-react"
import { nanoid } from "nanoid"

import { AppSidebar } from "@/components/home/sidebar"
import { ModelPicker } from "@/components/home/model-picker"
import { SidebarInset } from "@/components/ui/sidebar"
import { DitheringBackground } from "@/components/home/dithering-bg"
import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@/components/ai-elements/attachments"
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionAddScreenshot,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input"
import { DEFAULT_MODEL_ID } from "@/lib/models"

const SUGGESTIONS = [
  { label: "Summarize", prompt: "Summarize the key ideas from this article in a few bullet points." },
  { label: "Explain code", prompt: "Explain this code snippet to me like I'm a beginner." },
  { label: "Brainstorm", prompt: "Give me 10 creative weekend project ideas I could build with Next.js." },
  { label: "Look it up", prompt: "What are the most recent updates to the Next.js App Router?" },
  { label: "Create image", prompt: "Generate an image of a cozy open-source workspace at sunset." },
  { label: "Plan a trip", prompt: "Plan a 3-day itinerary for Tokyo focused on food and architecture." },
] as const

const PromptInputAttachmentsDisplay = () => {
  const attachments = usePromptInputAttachments()
  if (attachments.files.length === 0) return null
  return (
    <Attachments variant="inline">
      {attachments.files.map((attachment) => (
        <Attachment data={attachment} key={attachment.id} onRemove={() => attachments.remove(attachment.id)}>
          <AttachmentPreview />
          <AttachmentRemove />
        </Attachment>
      ))}
    </Attachments>
  )
}

export function HomePage() {
  const router = useRouter()
  const [text, setText] = React.useState("")
  const [model, setModel] = React.useState(DEFAULT_MODEL_ID)
  const [modelSelectorOpen, setModelSelectorOpen] = React.useState(false)
  const [useWebSearch, setUseWebSearch] = React.useState(false)

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text)
    const hasAttachments = Boolean(message.files?.length)
    if (!(hasText || hasAttachments)) return
    const chatId = nanoid()
    const params = new URLSearchParams()
    params.set("q", message.text || "Sent with attachments")
    params.set("model", model)
    if (useWebSearch) params.set("webSearch", "1")
    router.push(`/c/${chatId}?${params.toString()}`)
  }

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <div className="relative flex min-h-0 flex-1 flex-col">
          <DitheringBackground className="pointer-events-none absolute inset-0 opacity-40" />

          <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-10">
            <div className="flex w-full max-w-2xl flex-col items-center gap-6">
              <motion.div
                animate="show"
                className="flex flex-col items-center gap-3 text-center"
                custom={0}
                initial="hidden"
                variants={fadeUp}
              >
                <motion.span
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/70 px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-sm backdrop-blur"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="relative flex size-1.5">
                    <span className="absolute inset-0 animate-ping rounded-full bg-primary/60" />
                    <span className="relative size-1.5 rounded-full bg-primary" />
                  </span>
                  Open source · Built with the AI SDK
                </motion.span>
                <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
                  How can I help you today?
                </h1>
              </motion.div>

              <motion.div
                animate="show"
                className="w-full"
                custom={1}
                initial="hidden"
                variants={fadeUp}
              >
                <PromptInput onSubmit={handleSubmit} globalDrop multiple>
                  <PromptInputHeader>
                    <PromptInputAttachmentsDisplay />
                  </PromptInputHeader>
                  <PromptInputBody>
                    <PromptInputTextarea onChange={(e) => setText(e.target.value)} value={text} />
                  </PromptInputBody>
                  <PromptInputFooter>
                    <PromptInputTools>
                      <PromptInputActionMenu>
                        <PromptInputActionMenuTrigger />
                        <PromptInputActionMenuContent>
                          <PromptInputActionAddAttachments />
                          <PromptInputActionAddScreenshot />
                        </PromptInputActionMenuContent>
                      </PromptInputActionMenu>
                      <PromptInputButton
                        onClick={() => setUseWebSearch(!useWebSearch)}
                        tooltip={{ content: "Search the web", shortcut: "⌘K" }}
                        variant={useWebSearch ? "default" : "ghost"}
                      >
                        <GlobeIcon size={16} />
                        <span className="hidden sm:inline">Search</span>
                      </PromptInputButton>
                      <ModelPicker
                        model={model}
                        onModelChange={setModel}
                        onOpenChange={setModelSelectorOpen}
                        open={modelSelectorOpen}
                      />
                    </PromptInputTools>
                    <PromptInputSubmit disabled={!text} />
                  </PromptInputFooter>
                </PromptInput>
              </motion.div>

              <motion.div
                animate="show"
                className="flex w-full flex-wrap items-center justify-center gap-2"
                custom={2}
                initial="hidden"
                variants={fadeUp}
              >
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-[12.5px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    onClick={() => setText(s.prompt)}
                    type="button"
                  >
                    {s.label}
                  </button>
                ))}
              </motion.div>

              <motion.p
                animate="show"
                className="text-center text-[11px] text-muted-foreground/60"
                custom={3}
                initial="hidden"
                variants={fadeUp}
              >
                4chat can make mistakes. Check important info.
              </motion.p>
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  )
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.04 + i * 0.06,
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}
