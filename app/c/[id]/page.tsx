"use client";

import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@/components/ai-elements/attachments";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageBranch,
  MessageBranchContent,
  MessageBranchNext,
  MessageBranchPage,
  MessageBranchPrevious,
  MessageBranchSelector,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import { AppSidebar } from "@/components/home/sidebar";
import { ModelPicker } from "@/components/home/model-picker";
import { SidebarInset } from "@/components/ui/sidebar";
import { DEFAULT_MODEL_ID } from "@/lib/models";
import { useChat } from "@ai-sdk/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { GlobeIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const PromptInputAttachmentsDisplay = () => {
  const attachments = usePromptInputAttachments();
  if (attachments.files.length === 0) return null;
  return (
    <Attachments variant="inline">
      {attachments.files.map((attachment) => (
        <Attachment
          data={attachment}
          key={attachment.id}
          onRemove={() => attachments.remove(attachment.id)}
        >
          <AttachmentPreview />
          <AttachmentRemove />
        </Attachment>
      ))}
    </Attachments>
  );
};

export default function ChatPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [model, setModel] = useState<string>(
    searchParams.get("model") || DEFAULT_MODEL_ID
  );
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [text, setText] = useState<string>("");
  const [useWebSearch, setUseWebSearch] = useState<boolean>(
    searchParams.get("webSearch") === "1"
  );
  const { messages, status, sendMessage } = useChat();
  const initialMessageSent = useRef(false);

  useEffect(() => {
    if (initialMessageSent.current) return;
    const q = searchParams.get("q");
    if (!q) return;
    initialMessageSent.current = true;
    sendMessage(
      { text: q },
      {
        body: {
          model: searchParams.get("model") || DEFAULT_MODEL_ID,
          webSearch: searchParams.get("webSearch") === "1",
        },
      }
    );
    // Drop the ?q=&model=&webSearch= params from the URL now that the
    // message has been dispatched, so the address bar shows a clean
    // /c/[id] like a real chat app instead of leaking the initial prompt.
    router.replace(`/c/${params.id}`, { scroll: false });
  }, [searchParams, sendMessage, router, params.id]);

  const handleSubmit = useCallback(
    (message: PromptInputMessage) => {
      const hasText = Boolean(message.text);
      const hasAttachments = Boolean(message.files?.length);
      if (!(hasText || hasAttachments)) return;
      sendMessage(
        { text: message.text || "Sent with attachments", files: message.files },
        { body: { model, webSearch: useWebSearch } }
      );
      setText("");
    },
    [sendMessage, model, useWebSearch]
  );

  const isSubmitDisabled = useMemo(
    () => !(text.trim()) || status === "submitted" || status === "streaming",
    [text, status]
  );

  const hasMessages = messages.length > 0;

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <div className="relative flex min-h-0 flex-1 flex-col">
          {hasMessages ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <Conversation>
                <ConversationContent className="mx-auto w-full max-w-3xl">
                  {messages.map((message) => (
                    <MessageBranch defaultBranch={0} key={message.id}>
                      <MessageBranchContent>
                        <Message from={message.role} key={message.id}>
                          <div>
                            {message.parts.map((part, i) => {
                              switch (part.type) {
                                case "text":
                                  return (
                                    <MessageContent
                                      key={`${message.id}-${i}`}
                                    >
                                      <MessageResponse>
                                        {part.text}
                                      </MessageResponse>
                                    </MessageContent>
                                  );
                                case "reasoning":
                                  return (
                                    <Reasoning
                                      isStreaming={part.state === "streaming"}
                                      key={`${message.id}-${i}`}
                                    >
                                      <ReasoningTrigger />
                                      <ReasoningContent>
                                        {part.text}
                                      </ReasoningContent>
                                    </Reasoning>
                                  );
                                case "source-url":
                                  return (
                                    <Sources key={`${message.id}-${i}`}>
                                      <SourcesTrigger count={1} />
                                      <SourcesContent>
                                        <Source
                                          href={part.url}
                                          title={part.title ?? part.url}
                                        />
                                      </SourcesContent>
                                    </Sources>
                                  );
                                default:
                                  return null;
                              }
                            })}
                          </div>
                        </Message>
                      </MessageBranchContent>
                    </MessageBranch>
                  ))}
                </ConversationContent>
                <ConversationScrollButton />
              </Conversation>

              <div className="mx-auto w-full max-w-3xl shrink-0 px-4 pb-4 pt-2">
                <PromptInput globalDrop multiple onSubmit={handleSubmit}>
                  <PromptInputHeader>
                    <PromptInputAttachmentsDisplay />
                  </PromptInputHeader>
                  <PromptInputBody>
                    <PromptInputTextarea
                      onChange={(e) => setText(e.target.value)}
                      value={text}
                    />
                  </PromptInputBody>
                  <PromptInputFooter>
                    <PromptInputTools>
                      <PromptInputActionMenu>
                        <PromptInputActionMenuTrigger />
                        <PromptInputActionMenuContent>
                          <PromptInputActionAddAttachments />
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
                    <PromptInputSubmit
                      disabled={isSubmitDisabled}
                      status={status}
                    />
                  </PromptInputFooter>
                </PromptInput>
              </div>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4">
              <div className="flex w-full max-w-2xl flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-3 text-center">
                  <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
                    How can I help you today?
                  </h1>
                </div>

                <div className="w-full">
                  <PromptInput globalDrop multiple onSubmit={handleSubmit}>
                    <PromptInputHeader>
                      <PromptInputAttachmentsDisplay />
                    </PromptInputHeader>
                    <PromptInputBody>
                      <PromptInputTextarea
                        onChange={(e) => setText(e.target.value)}
                        value={text}
                      />
                    </PromptInputBody>
                    <PromptInputFooter>
                      <PromptInputTools>
                        <PromptInputActionMenu>
                          <PromptInputActionMenuTrigger />
                          <PromptInputActionMenuContent>
                            <PromptInputActionAddAttachments />
                          </PromptInputActionMenuContent>
                        </PromptInputActionMenu>
                        <PromptInputButton
                          onClick={() => setUseWebSearch(!useWebSearch)}
                          tooltip={{
                            content: "Search the web",
                            shortcut: "⌘K",
                          }}
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
                      <PromptInputSubmit
                        disabled={isSubmitDisabled}
                        status={status}
                      />
                    </PromptInputFooter>
                  </PromptInput>
                </div>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </>
  );
}
