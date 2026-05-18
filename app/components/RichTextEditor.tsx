'use client';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        minHeight: 200,
        border: '1px solid #d9d9d9',
        borderRadius: 6,
        backgroundColor: '#fafafa',
      }}
    />
  ),
});

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote'],
    ['clean'],
  ],
};

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export default function RichTextEditor({ value, onChange, placeholder, minHeight = 200 }: Props) {
  return (
    <div style={{ '--ql-min-height': `${minHeight}px` } as React.CSSProperties}>
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
        style={{ minHeight }}
      />
      <style>{`.ql-editor { min-height: ${minHeight}px; }`}</style>
    </div>
  );
}
