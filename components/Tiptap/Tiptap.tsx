'use client'

import { useEditor, EditorContent, Editor as TiptapEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Heading3,
  Image as ImageIcon,
  List,
  ListOrdered
} from 'lucide-react'
import styles from './Tiptap.module.scss'

const MenuBar = ({ editor }: { editor: TiptapEditor }) => {

  if (!editor) {
    return null
  }

  return (
    <div className={styles.menuBar}>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`${styles.button} ${editor.isActive('bold') ? styles.active : ''}`}
        title="Bold"
      >
        <Bold size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`${styles.button} ${editor.isActive('italic') ? styles.active : ''}`}
        title="Italic"
      >
        <Italic size={18} />
      </button>

      <div className={styles.divider} />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`${styles.button} ${editor.isActive('heading', { level: 1 }) ? styles.active : ''}`}
        title="Heading 1"
      >
        <Heading1 size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${styles.button} ${editor.isActive('heading', { level: 2 }) ? styles.active : ''}`}
        title="Heading 2"
      >
        <Heading2 size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`${styles.button} ${editor.isActive('heading', { level: 3 }) ? styles.active : ''}`}
        title="Heading 3"
      >
        <Heading3 size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`${styles.button} ${editor.isActive('paragraph') ? styles.active : ''}`}
        title="Paragraph"
      >
        P
      </button>

      <div className={styles.divider} />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${styles.button} ${editor.isActive('bulletList') ? styles.active : ''}`}
        title="Bullet List"
      >
        <List size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${styles.button} ${editor.isActive('orderedList') ? styles.active : ''}`}
        title="Numbered List"
      >
        <ListOrdered size={18} />
      </button>

    </div>
  )
}

const Tiptap = ({ setContent }: { setContent: (content: string) => void }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
    ],
    content: '<p></p>',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: styles.editor,
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())
    },
  })

  return (
    <div className={styles.container}>
      {editor && <MenuBar editor={editor} />}
      {editor && <EditorContent editor={editor} />}
    </div>
  )
}

export default Tiptap