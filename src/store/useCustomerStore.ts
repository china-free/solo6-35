import { create } from 'zustand';
import type { Customer, CustomerFormData, FollowupNote, NoteFormData, CustomerStatus } from '../types';
import { STATUS_CONFIG, STATUS_ORDER, STORAGE_KEY } from '../config/statusConfig';
import { generateId, nowISO, validatePhone } from '../utils/helpers';

interface AppData {
  customers: Customer[];
  notes: FollowupNote[];
}

interface FilterParams {
  query: string;
  status: CustomerStatus | 'all';
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

interface StatusStat {
  status: CustomerStatus;
  label: string;
  color: string;
  count: number;
  percent: number;
}

interface Statistics {
  total: number;
  byStatus: StatusStat[];
  pieData: Array<{ name: string; value: number; color: string; status: CustomerStatus }>;
}

interface ValidationResult<T extends object = CustomerFormData> {
  valid: boolean;
  errors: Partial<Record<keyof T, string>>;
}

interface CustomerDetail {
  customer: Customer;
  notes: FollowupNote[];
  noteCount: number;
  lastNoteAt: string | null;
}

const INITIAL_DATA: AppData = {
  customers: [
    {
      id: 'c1',
      name: '北京鑫源科技有限公司',
      contact: '张明远',
      phone: '13800138001',
      status: 'contacted',
      createdAt: '2026-06-05T10:30:00',
      updatedAt: '2026-06-12T14:20:00',
    },
    {
      id: 'c2',
      name: '上海鼎盛贸易集团',
      contact: '李婷婷',
      phone: '13900139002',
      status: 'quoted',
      createdAt: '2026-06-03T09:15:00',
      updatedAt: '2026-06-14T11:00:00',
    },
    {
      id: 'c3',
      name: '深圳创新电子股份公司',
      contact: '王建国',
      phone: '13700137003',
      status: 'closed',
      createdAt: '2026-05-28T16:45:00',
      updatedAt: '2026-06-10T09:30:00',
    },
    {
      id: 'c4',
      name: '广州华美纺织有限公司',
      contact: '陈美玲',
      phone: '13600136004',
      status: 'pending',
      createdAt: '2026-06-14T08:00:00',
      updatedAt: '2026-06-14T08:00:00',
    },
    {
      id: 'c5',
      name: '杭州云端网络科技',
      contact: '刘晓峰',
      phone: '13500135005',
      status: 'lost',
      createdAt: '2026-05-20T13:20:00',
      updatedAt: '2026-06-08T16:50:00',
    },
    {
      id: 'c6',
      name: '成都蜀源食品有限公司',
      contact: '赵丽华',
      phone: '13400134006',
      status: 'contacted',
      createdAt: '2026-06-08T11:10:00',
      updatedAt: '2026-06-15T10:30:00',
    },
    {
      id: 'c7',
      name: '武汉长江物流集团',
      contact: '孙志强',
      phone: '13300133007',
      status: 'pending',
      createdAt: '2026-06-13T14:25:00',
      updatedAt: '2026-06-13T14:25:00',
    },
    {
      id: 'c8',
      name: '西安古都文旅发展',
      contact: '周文博',
      phone: '13200132008',
      status: 'quoted',
      createdAt: '2026-06-01T09:40:00',
      updatedAt: '2026-06-11T15:15:00',
    },
  ],
  notes: [
    {
      id: 'n1',
      customerId: 'c1',
      content: '初次电话联系，客户表示有采购意向，约定下周面谈。关注产品线A和B的报价方案。',
      createdAt: '2026-06-10T10:30:00',
    },
    {
      id: 'n2',
      customerId: 'c1',
      content: '面谈顺利，客户对方案很满意，已发送详细产品手册。等待客户内部审批流程，预计3个工作日反馈。',
      createdAt: '2026-06-12T14:20:00',
    },
    {
      id: 'n3',
      customerId: 'c2',
      content: '客户确认需求：年度框架合作，预计Q3采购量约50万。已安排技术对接会议。',
      createdAt: '2026-06-05T09:30:00',
    },
    {
      id: 'n4',
      customerId: 'c2',
      content: '已发送正式报价单，客户反馈价格偏高10%，正在申请特批折扣，预计本周给到最终结果。',
      createdAt: '2026-06-14T11:00:00',
    },
    {
      id: 'n5',
      customerId: 'c3',
      content: '完成合同签署，首批订单金额28万元。已安排生产排期，预计月底交付。',
      createdAt: '2026-06-10T09:30:00',
    },
    {
      id: 'n6',
      customerId: 'c5',
      content: '多次跟进无回复，客户反馈已选择竞品。已录入流失原因记录，后续6个月后再回访。',
      createdAt: '2026-06-08T16:50:00',
    },
    {
      id: 'n7',
      customerId: 'c6',
      content: '客户咨询定制化方案，已转接技术部门对接。需要提供现场勘测服务，约定6月18日上门。',
      createdAt: '2026-06-15T10:30:00',
    },
  ],
};

function loadFromStorage(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return INITIAL_DATA;
}

function saveToStorage(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

const initial = loadFromStorage();

interface CustomerStore {
  customers: Customer[];
  notes: FollowupNote[];

  validateCustomerForm: (data: Partial<CustomerFormData>, forEdit?: boolean) => ValidationResult;
  validateNoteForm: (data: NoteFormData) => ValidationResult;

  getFilteredCustomers: (params: Partial<FilterParams>) => Customer[];
  getStatistics: () => Statistics;
  getCustomerDetail: (id: string) => CustomerDetail | null;
  getCustomerNotes: (customerId: string) => FollowupNote[];
  getCustomerById: (id: string) => Customer | undefined;

  addCustomer: (data: CustomerFormData) => { success: boolean; customer?: Customer; errors?: ValidationResult['errors'] };
  updateCustomer: (id: string, data: Partial<CustomerFormData>) => { success: boolean; errors?: ValidationResult['errors'] };
  deleteCustomer: (id: string) => void;
  changeCustomerStatus: (id: string, status: CustomerStatus) => void;

  addNote: (customerId: string, data: NoteFormData) => { success: boolean; note?: FollowupNote; errors?: ValidationResult['errors'] };

  shouldFollowUp: (customerId: string) => { needFollow: boolean; reason?: string };
  getRecentActivity: (limit?: number) => Array<{ type: 'note' | 'status' | 'create'; customer: Customer; note?: FollowupNote; timestamp: string }>;

  resetData: () => void;
}

export const useCustomerStore = create<CustomerStore>((set, get) => ({
  customers: initial.customers,
  notes: initial.notes,

  validateCustomerForm: (data, forEdit = false) => {
    const errors: ValidationResult['errors'] = {};

    if (!forEdit || data.name !== undefined) {
      const name = data.name?.trim() ?? '';
      if (!name) errors.name = '请输入客户名称';
      else if (name.length < 2) errors.name = '客户名称至少2个字符';
    }

    if (!forEdit || data.contact !== undefined) {
      const contact = data.contact?.trim() ?? '';
      if (!contact) errors.contact = '请输入联系人姓名';
    }

    if (!forEdit || data.phone !== undefined) {
      const phone = data.phone?.trim() ?? '';
      if (!phone) {
        errors.phone = '请输入联系电话';
      } else if (!validatePhone(phone)) {
        errors.phone = '请输入有效的联系电话（支持手机号、座机、400电话等）';
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  },

  validateNoteForm: (data): ValidationResult<NoteFormData> => {
    const errors: Partial<Record<keyof NoteFormData, string>> = {};
    const content = data.content.trim();

    if (!content) errors.content = '请输入跟进内容';
    else if (content.length < 2) errors.content = '跟进内容至少2个字符';
    else if (content.length > 500) errors.content = '跟进内容不能超过500个字符';

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  },

  getFilteredCustomers: (params) => {
    const { customers } = get();
    const { query = '', status = 'all', sortBy = 'updatedAt', sortOrder = 'desc' } = params;

    let result = [...customers];

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q));
    }

    if (status !== 'all') {
      result = result.filter((c) => c.status === status);
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name, 'zh-CN');
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
        default:
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  },

  getStatistics: () => {
    const { customers } = get();
    const total = customers.length;

    const byStatus = STATUS_ORDER.map((status) => {
      const count = customers.filter((c) => c.status === status).length;
      return {
        status,
        label: STATUS_CONFIG[status].label,
        color: STATUS_CONFIG[status].color,
        count,
        percent: total > 0 ? Math.round((count / total) * 100) : 0,
      };
    });

    const pieData = byStatus
      .filter((s) => s.count > 0)
      .map((s) => ({
        name: s.label,
        value: s.count,
        color: s.color,
        status: s.status,
      }));

    return { total, byStatus, pieData };
  },

  getCustomerDetail: (id) => {
    const customer = get().customers.find((c) => c.id === id);
    if (!customer) return null;

    const notes = get()
      .notes.filter((n) => n.customerId === id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      customer,
      notes,
      noteCount: notes.length,
      lastNoteAt: notes.length > 0 ? notes[0].createdAt : null,
    };
  },

  getCustomerNotes: (customerId) => {
    return get()
      .notes.filter((n) => n.customerId === customerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getCustomerById: (id) => {
    return get().customers.find((c) => c.id === id);
  },

  addCustomer: (data) => {
    const validation = get().validateCustomerForm(data);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    const now = nowISO();
    const customer: Customer = {
      id: generateId(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    set((state) => {
      const newCustomers = [customer, ...state.customers];
      saveToStorage({ customers: newCustomers, notes: state.notes });
      return { customers: newCustomers };
    });

    return { success: true, customer };
  },

  updateCustomer: (id, data) => {
    const validation = get().validateCustomerForm(data, true);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    set((state) => {
      const newCustomers = state.customers.map((c) =>
        c.id === id ? { ...c, ...data, updatedAt: nowISO() } : c,
      );
      saveToStorage({ customers: newCustomers, notes: state.notes });
      return { customers: newCustomers };
    });

    return { success: true };
  },

  deleteCustomer: (id) => {
    set((state) => {
      const newCustomers = state.customers.filter((c) => c.id !== id);
      const newNotes = state.notes.filter((n) => n.customerId !== id);
      saveToStorage({ customers: newCustomers, notes: newNotes });
      return { customers: newCustomers, notes: newNotes };
    });
  },

  changeCustomerStatus: (id, status) => {
    set((state) => {
      const newCustomers = state.customers.map((c) =>
        c.id === id ? { ...c, status, updatedAt: nowISO() } : c,
      );
      saveToStorage({ customers: newCustomers, notes: state.notes });
      return { customers: newCustomers };
    });
  },

  addNote: (customerId, data) => {
    const validation = get().validateNoteForm(data);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    const note: FollowupNote = {
      id: generateId(),
      customerId,
      content: data.content.trim(),
      createdAt: nowISO(),
    };

    set((state) => {
      const newNotes = [note, ...state.notes];
      const newCustomers = state.customers.map((c) =>
        c.id === customerId ? { ...c, updatedAt: note.createdAt } : c,
      );
      saveToStorage({ customers: newCustomers, notes: newNotes });
      return { notes: newNotes, customers: newCustomers };
    });

    return { success: true, note };
  },

  shouldFollowUp: (customerId) => {
    const detail = get().getCustomerDetail(customerId);
    if (!detail) return { needFollow: false };

    const { customer, lastNoteAt } = detail;

    if (customer.status === 'pending') {
      return { needFollow: true, reason: '新客户待首次联系' };
    }

    if (customer.status === 'lost') {
      return { needFollow: false };
    }

    if (customer.status === 'closed') {
      if (!lastNoteAt) return { needFollow: true, reason: '成交客户需定期维护' };
      const daysSinceLastNote = Math.floor(
        (Date.now() - new Date(lastNoteAt).getTime()) / (1000 * 60 * 60 * 24),
      );
      if (daysSinceLastNote > 30) {
        return { needFollow: true, reason: '成交客户超过30天未跟进，建议回访维护' };
      }
      return { needFollow: false };
    }

    if (!lastNoteAt) {
      return { needFollow: true, reason: '暂无跟进记录，建议尽快联系' };
    }

    const daysSinceLastNote = Math.floor(
      (Date.now() - new Date(lastNoteAt).getTime()) / (1000 * 60 * 60 * 24),
    );

    if (customer.status === 'contacted' && daysSinceLastNote > 3) {
      return { needFollow: true, reason: '已联系客户超过3天未跟进' };
    }

    if (customer.status === 'quoted' && daysSinceLastNote > 7) {
      return { needFollow: true, reason: '已报价客户超过7天未跟进' };
    }

    return { needFollow: false };
  },

  getRecentActivity: (limit = 10) => {
    const { customers, notes } = get();
    const activities: Array<{ type: 'note' | 'status' | 'create'; customer: Customer; note?: FollowupNote; timestamp: string }> = [];

    customers.forEach((customer) => {
      activities.push({
        type: 'create',
        customer,
        timestamp: customer.createdAt,
      });
    });

    notes.forEach((note) => {
      const customer = customers.find((c) => c.id === note.customerId);
      if (customer) {
        activities.push({
          type: 'note',
          customer,
          note,
          timestamp: note.createdAt,
        });
      }
    });

    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return activities.slice(0, limit);
  },

  resetData: () => {
    saveToStorage(INITIAL_DATA);
    set({ customers: INITIAL_DATA.customers, notes: INITIAL_DATA.notes });
  },
}));
