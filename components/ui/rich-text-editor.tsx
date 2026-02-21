"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Highlight from "@tiptap/extension-highlight"
import Image from "@tiptap/extension-image"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { common, createLowlight } from "lowlight"
import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Unlink,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Image as ImageIcon,
  FileCode,
  Minus,
  Type,
  Pilcrow,
} from "lucide-react"
import { cn } from "@/lib/utils"

const lowlight = createLowlight(common)

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  error?: boolean
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing your content...",
  disabled = false,
  className,
  error = false,
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  const editor = useEditor({
    immediatelyRender: false, // Disable SSR to avoid hydration mismatches
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Use CodeBlockLowlight instead
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({
        multicolor: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "rounded-md bg-muted p-4 font-mono text-sm",
        },
      }),
    ],
    content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm dark:prose-invert max-w-none min-h-[400px] p-4 focus:outline-none",
          "prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl",
          "prose-p:text-foreground prose-p:leading-relaxed",
          "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
          "prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic",
          "prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm",
          "prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg",
          "prose-ul:list-disc prose-ol:list-decimal",
          "prose-img:rounded-lg prose-img:my-4"
        ),
      },
    },
  })

  // Sync external content changes
  useEffect(() => {
    if (editor && content !== editor.getHTML() && content === "") {
      editor.commands.clearContent()
    }
  }, [content, editor])

  const setLink = useCallback(() => {
    if (!editor) return

    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    setLinkUrl("")
  }, [editor, linkUrl])

  const addImage = useCallback(() => {
    if (!editor || !imageUrl) return

    const url = imageUrl.startsWith("http") ? imageUrl : `https://${imageUrl}`
    editor.chain().focus().setImage({ src: url }).run()
    setImageUrl("")
  }, [editor, imageUrl])

  if (!editor) {
    return (
      <div className="w-full h-[500px] border rounded-lg bg-muted/50 animate-pulse" />
    )
  }

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled: btnDisabled = false,
    tooltip,
    children,
  }: {
    onClick: () => void
    isActive?: boolean
    disabled?: boolean
    tooltip: string
    children: React.ReactNode
  }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClick}
          disabled={btnDisabled || disabled}
          className={cn(
            "h-8 w-8 p-0",
            isActive && "bg-muted text-primary"
          )}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn(
          "w-full border rounded-lg overflow-hidden transition-colors",
          error ? "border-destructive" : "border-input",
          disabled ? "opacity-50 cursor-not-allowed" : "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          className
        )}
      >
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 p-1.5 bg-muted/50 border-b">
          {/* Text Style */}
          <div className="flex items-center">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              tooltip="Bold (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              tooltip="Italic (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive("underline")}
              tooltip="Underline (Ctrl+U)"
            >
              <UnderlineIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive("strike")}
              tooltip="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              isActive={editor.isActive("highlight")}
              tooltip="Highlight"
            >
              <Highlighter className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive("code")}
              tooltip="Inline Code"
            >
              <Code className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Headings */}
          <div className="flex items-center">
            <ToolbarButton
              onClick={() => editor.chain().focus().setParagraph().run()}
              isActive={editor.isActive("paragraph")}
              tooltip="Paragraph"
            >
              <Pilcrow className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive("heading", { level: 1 })}
              tooltip="Heading 1"
            >
              <Heading1 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive("heading", { level: 2 })}
              tooltip="Heading 2"
            >
              <Heading2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={editor.isActive("heading", { level: 3 })}
              tooltip="Heading 3"
            >
              <Heading3 className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Lists & Blocks */}
          <div className="flex items-center">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
              tooltip="Bullet List"
            >
              <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
              tooltip="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive("blockquote")}
              tooltip="Quote"
            >
              <Quote className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              isActive={editor.isActive("codeBlock")}
              tooltip="Code Block"
            >
              <FileCode className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              tooltip="Horizontal Rule"
            >
              <Minus className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Alignment */}
          <div className="flex items-center">
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              isActive={editor.isActive({ textAlign: "left" })}
              tooltip="Align Left"
            >
              <AlignLeft className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              isActive={editor.isActive({ textAlign: "center" })}
              tooltip="Align Center"
            >
              <AlignCenter className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              isActive={editor.isActive({ textAlign: "right" })}
              tooltip="Align Right"
            >
              <AlignRight className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("justify").run()}
              isActive={editor.isActive({ textAlign: "justify" })}
              tooltip="Justify"
            >
              <AlignJustify className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Link */}
          <div className="flex items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={disabled}
                  className={cn(
                    "h-8 w-8 p-0",
                    editor.isActive("link") && "bg-muted text-primary"
                  )}
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Insert Link</p>
                  <Input
                    placeholder="https://example.com"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && setLink()}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={setLink} className="flex-1">
                      Apply
                    </Button>
                    {editor.isActive("link") && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => editor.chain().focus().unsetLink().run()}
                      >
                        <Unlink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Image */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={disabled}
                  className="h-8 w-8 p-0"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Insert Image URL</p>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addImage()}
                  />
                  <Button size="sm" onClick={addImage} className="w-full">
                    Insert Image
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex-1" />

          {/* Undo/Redo */}
          <div className="flex items-center">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              tooltip="Undo (Ctrl+Z)"
            >
              <Undo className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              tooltip="Redo (Ctrl+Y)"
            >
              <Redo className="h-4 w-4" />
            </ToolbarButton>
          </div>
        </div>

        {/* Editor Content */}
        <EditorContent editor={editor} />

        {/* Editor Styles */}
        <style jsx global>{`
          .ProseMirror {
            min-height: 400px;
          }
          .ProseMirror p.is-editor-empty:first-child::before {
            color: hsl(var(--muted-foreground));
            content: attr(data-placeholder);
            float: left;
            height: 0;
            pointer-events: none;
          }
          .ProseMirror:focus {
            outline: none;
          }
          .ProseMirror > * + * {
            margin-top: 0.75em;
          }
          .ProseMirror ul,
          .ProseMirror ol {
            padding-left: 1.5rem;
          }
          .ProseMirror blockquote {
            border-left: 3px solid hsl(var(--primary));
            padding-left: 1rem;
            margin-left: 0;
            font-style: italic;
          }
          .ProseMirror pre {
            background: hsl(var(--muted));
            border-radius: 0.5rem;
            padding: 1rem;
            overflow-x: auto;
          }
          .ProseMirror pre code {
            background: none;
            padding: 0;
            font-size: 0.875rem;
          }
          .ProseMirror code {
            background: hsl(var(--muted));
            padding: 0.2rem 0.4rem;
            border-radius: 0.25rem;
            font-size: 0.875rem;
          }
          .ProseMirror img {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
          }
          .ProseMirror mark {
            background-color: hsl(var(--primary) / 0.3);
            padding: 0.1rem 0.2rem;
            border-radius: 0.2rem;
          }
          .ProseMirror hr {
            border: none;
            border-top: 2px solid hsl(var(--border));
            margin: 2rem 0;
          }
        `}</style>
      </div>
    </TooltipProvider>
  )
}
