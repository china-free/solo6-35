import { useState, useEffect } from 'react';
import type { Customer, CustomerFormData } from '../types';
import { useCustomerActions } from '../store/selectors';

interface UseCustomerFormOptions {
  initialData?: Customer | null;
  onSuccess?: () => void;
}

export function useCustomerForm({ initialData = null, onSuccess }: UseCustomerFormOptions = {}) {
  const { validateCustomerForm, addCustomer, updateCustomer } = useCustomerActions();
  const [form, setForm] = useState<CustomerFormData>({
    name: '',
    contact: '',
    phone: '',
    status: 'pending',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerFormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        contact: initialData.contact,
        phone: initialData.phone,
        status: initialData.status,
      });
    } else {
      setForm({ name: '', contact: '', phone: '', status: 'pending' });
    }
    setErrors({});
    setSubmitted(false);
  }, [initialData]);

  const setField = <K extends keyof CustomerFormData>(
    field: K,
    value: CustomerFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (submitted && errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    const validation = validateCustomerForm(form, !!initialData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return { success: false };
    }

    setLoading(true);
    try {
      let result;
      if (initialData) {
        result = updateCustomer(initialData.id, form);
      } else {
        result = addCustomer(form);
      }

      if (result.success) {
        onSuccess?.();
        return { success: true, customer: 'customer' in result ? result.customer : undefined };
      } else {
        setErrors(result.errors || {});
        return { success: false };
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    if (initialData) {
      setForm({
        name: initialData.name,
        contact: initialData.contact,
        phone: initialData.phone,
        status: initialData.status,
      });
    } else {
      setForm({ name: '', contact: '', phone: '', status: 'pending' });
    }
    setErrors({});
    setSubmitted(false);
  };

  return {
    form,
    errors,
    submitted,
    loading,
    setField,
    handleSubmit,
    reset,
  };
}
