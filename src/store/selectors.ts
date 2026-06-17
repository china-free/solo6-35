import type { Customer, CustomerFormData, CustomerStatus, FollowupNote, NoteFormData } from '../types';
import { useCustomerStore } from './useCustomerStore';

export const useCustomers = () => useCustomerStore((state) => state.customers);

export const useNotes = () => useCustomerStore((state) => state.notes);

export const useStatistics = () => useCustomerStore((state) => state.getStatistics());

export const useFilteredCustomers = (params: {
  query: string;
  status: CustomerStatus | 'all';
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}) =>
  useCustomerStore((state) => state.getFilteredCustomers(params));

export const useCustomerById = (id: string | undefined) =>
  useCustomerStore((state) => (id ? state.getCustomerById(id) : undefined));

export const useCustomerDetail = (id: string | undefined) =>
  useCustomerStore((state) => (id ? state.getCustomerDetail(id) : null));

export const useCustomerNotes = (customerId: string | undefined) =>
  useCustomerStore((state) =>
    customerId ? state.getCustomerNotes(customerId) : []
  );

export const useShouldFollowUp = (customerId: string | undefined) =>
  useCustomerStore((state) =>
    customerId ? state.shouldFollowUp(customerId) : { needFollow: false }
  );

export const useRecentActivity = (limit?: number) =>
  useCustomerStore((state) => state.getRecentActivity(limit));

export const useCustomerActions = () => {
  const addCustomer = useCustomerStore((state) => state.addCustomer);
  const updateCustomer = useCustomerStore((state) => state.updateCustomer);
  const deleteCustomer = useCustomerStore((state) => state.deleteCustomer);
  const changeCustomerStatus = useCustomerStore((state) => state.changeCustomerStatus);
  const addNote = useCustomerStore((state) => state.addNote);
  const resetData = useCustomerStore((state) => state.resetData);
  const validateCustomerForm = useCustomerStore((state) => state.validateCustomerForm);
  const validateNoteForm = useCustomerStore((state) => state.validateNoteForm);

  return {
    addCustomer,
    updateCustomer,
    deleteCustomer,
    changeCustomerStatus,
    addNote,
    resetData,
    validateCustomerForm,
    validateNoteForm,
  };
};

export const useCustomerList = (
  query: string,
  statusFilter: CustomerStatus | 'all'
) => {
  const customers = useFilteredCustomers({ query, status: statusFilter });
  const stats = useStatistics();
  const actions = useCustomerActions();

  return {
    customers,
    stats,
    ...actions,
  };
};

export type { Customer, CustomerFormData, NoteFormData, FollowupNote, CustomerStatus };
