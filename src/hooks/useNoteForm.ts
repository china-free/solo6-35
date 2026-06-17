import { useState } from 'react';
import type { NoteFormData } from '../types';
import { useCustomerActions } from '../store/selectors';

interface UseNoteFormOptions {
  customerId: string;
  onSuccess?: () => void;
}

export function useNoteForm({ customerId, onSuccess }: UseNoteFormOptions) {
  const { validateNoteForm, addNote } = useCustomerActions();
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const maxLength = 500;

  const handleChange = (value: string) => {
    setContent(value.slice(0, maxLength));
    if (error) setError('');
  };

  const insertTemplate = (template: string) => {
    const prefix = content ? `${content}\n` : '';
    setContent(`${prefix}【${template}】：`);
    if (error) setError('');
  };

  const handleSubmit = async () => {
    setSubmitted(true);

    const validation = validateNoteForm({ content });
    if (!validation.valid) {
      setError((validation.errors as { content?: string }).content || '请输入有效的跟进内容');
      return { success: false };
    }

    setLoading(true);
    try {
      const result = addNote(customerId, { content });
      if (result.success) {
        setContent('');
        setError('');
        setSubmitted(false);
        onSuccess?.();
        return { success: true, note: result.note };
      } else {
        setError((result.errors as { content?: string })?.content || '保存失败，请重试');
        return { success: false };
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setContent('');
    setError('');
    setSubmitted(false);
  };

  return {
    content,
    error,
    submitted,
    loading,
    maxLength,
    charCount: content.length,
    handleChange,
    insertTemplate,
    handleSubmit,
    reset,
  };
}
