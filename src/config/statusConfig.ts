import type { CustomerStatus } from '../types';

export const STATUS_CONFIG: Record<CustomerStatus, { label: string; color: string; bgColor: string }> = {
  pending:   { label: '待联系', color: '#94a3b8', bgColor: '#f1f5f9' },
  contacted: { label: '已联系', color: '#3b82f6', bgColor: '#dbeafe' },
  quoted:    { label: '已报价', color: '#f59e0b', bgColor: '#fef3c7' },
  closed:    { label: '已成交', color: '#10b981', bgColor: '#d1fae5' },
  lost:      { label: '已流失', color: '#ef4444', bgColor: '#fee2e2' },
};

export const STATUS_ORDER: CustomerStatus[] = ['pending', 'contacted', 'quoted', 'closed', 'lost'];

export const STORAGE_KEY = 'customer_management_platform_v1';
