"use client";

import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
	Bold,
	Code,
	Heading2,
	Italic,
	List,
	ListOrdered,
	Quote,
	Strikethrough,
} from "lucide-react";
import { useEffect } from "react";

interface RichTextEditorProps {
	value: string;
	onChange: (value: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
	if (!editor) {
		return null;
	}

	return (
		<div className="flex flex-wrap items-center gap-1 border-b border-white/10 bg-white/5 px-3 py-2 rounded-t-xl">
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleBold().run()}
				className={`p-1.5 rounded-md transition-colors ${
					editor.isActive("bold")
						? "bg-white/20 text-white"
						: "text-zinc-400 hover:bg-white/10 hover:text-white"
				}`}
				title="Bold"
			>
				<Bold size={16} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleItalic().run()}
				className={`p-1.5 rounded-md transition-colors ${
					editor.isActive("italic")
						? "bg-white/20 text-white"
						: "text-zinc-400 hover:bg-white/10 hover:text-white"
				}`}
				title="Italic"
			>
				<Italic size={16} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleStrike().run()}
				className={`p-1.5 rounded-md transition-colors ${
					editor.isActive("strike")
						? "bg-white/20 text-white"
						: "text-zinc-400 hover:bg-white/10 hover:text-white"
				}`}
				title="Strikethrough"
			>
				<Strikethrough size={16} />
			</button>

			<div className="w-[1px] h-4 bg-white/10 mx-1" />

			<button
				type="button"
				onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
				className={`p-1.5 rounded-md transition-colors ${
					editor.isActive("heading", { level: 2 })
						? "bg-white/20 text-white"
						: "text-zinc-400 hover:bg-white/10 hover:text-white"
				}`}
				title="Heading 2"
			>
				<Heading2 size={16} />
			</button>

			<div className="w-[1px] h-4 bg-white/10 mx-1" />

			<button
				type="button"
				onClick={() => editor.chain().focus().toggleBulletList().run()}
				className={`p-1.5 rounded-md transition-colors ${
					editor.isActive("bulletList")
						? "bg-white/20 text-white"
						: "text-zinc-400 hover:bg-white/10 hover:text-white"
				}`}
				title="Bullet List"
			>
				<List size={16} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
				className={`p-1.5 rounded-md transition-colors ${
					editor.isActive("orderedList")
						? "bg-white/20 text-white"
						: "text-zinc-400 hover:bg-white/10 hover:text-white"
				}`}
				title="Ordered List"
			>
				<ListOrdered size={16} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleBlockquote().run()}
				className={`p-1.5 rounded-md transition-colors ${
					editor.isActive("blockquote")
						? "bg-white/20 text-white"
						: "text-zinc-400 hover:bg-white/10 hover:text-white"
				}`}
				title="Quote"
			>
				<Quote size={16} />
			</button>

			<div className="w-[1px] h-4 bg-white/10 mx-1" />

			<button
				type="button"
				onClick={() => editor.chain().focus().toggleCodeBlock().run()}
				className={`p-1.5 rounded-md transition-colors ${
					editor.isActive("codeBlock")
						? "bg-white/20 text-white"
						: "text-zinc-400 hover:bg-white/10 hover:text-white"
				}`}
				title="Code Block"
			>
				<Code size={16} />
			</button>
		</div>
	);
};

export default function RichTextEditor({
	value,
	onChange,
}: RichTextEditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Link.configure({
				openOnClick: false,
				HTMLAttributes: {
					class:
						"text-light-blue hover:text-white transition-colors cursor-pointer",
				},
			}),
		],
		content: value,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
		editorProps: {
			attributes: {
				class:
					"prose prose-invert max-w-none text-zinc-300 prose-headings:text-white prose-p:text-zinc-300 prose-ul:list-disc prose-ol:list-decimal prose-ul:pl-6 prose-ol:pl-6 prose-li:my-1 min-h-[300px] w-full resize-y bg-white/5 px-4 py-4 text-sm text-white placeholder-zinc-600 transition-all duration-200 focus:outline-none focus:ring-0",
			},
		},
	});

	// Keep editor content in sync if value changes externally (e.g. form reset)
	useEffect(() => {
		if (editor && value !== editor.getHTML()) {
			editor.commands.setContent(value);
		}
	}, [value, editor]);

	return (
		<div className="rounded-xl border border-white/10 overflow-hidden bg-transparent focus-within:border-white/30 focus-within:ring-2 focus-within:ring-white/20 transition-all duration-200">
			<MenuBar editor={editor} />
			<EditorContent editor={editor} />
		</div>
	);
}
