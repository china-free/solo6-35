import { create } from 'zustand';
import type { Customer, CustomerFormData, FollowupNote, NoteFormData } from '../types';
import { STORAGE_KEY } from '../config/statusConfig';
import { generateId, nowISO } from '../utils/helpers';

interface AppData {
  customers: Customer[];
  notes: FollowupNote[];
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
  addCustomer: (data: CustomerFormData) => Customer;
  updateCustomer: (id: string, data: Partial<CustomerFormData>) => void;
  deleteCustomer: (id: string) => void;
  updateCustomerStatus: (id: string, status: CustomerFormData['status']) => void;
  getCustomer: (id: string) => Customer | undefined;
  getNotesByCustomer: (customerId: string) => FollowupNote[];
  addNote: (customerId: string, data: NoteFormData) => FollowupNote;
  searchFilter: (query: string, statusFilter: string) => Customer[];
  resetData: () => void;
}

export const useCustomerStore = create<CustomerStore>((set, get) => ({
  customers: initial.customers,
  notes: initial.notes,

  addCustomer: (data) => {
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
    return customer;
  },

  updateCustomer: (id, data) => {
    set((state) => {
      const newCustomers = state.customers.map((c) =>
        c.id === id ? { ...c, ...data, updatedAt: nowISO() } : c,
      );
      saveToStorage({ customers: newCustomers, notes: state.notes });
      return { customers: newCustomers };
    });
  },

  deleteCustomer: (id) => {
    set((state) => {
      const newCustomers = state.customers.filter((c) => c.id !== id);
      const newNotes = state.notes.filter((n) => n.customerId !== id);
      saveToStorage({ customers: newCustomers, notes: newNotes });
      return { customers: newCustomers, notes: newNotes };
    });
  },

  updateCustomerStatus: (id, status) => {
    set((state) => {
      const newCustomers = state.customers.map((c) =>
        c.id === id ? { ...c, status, updatedAt: nowISO() } : c,
      );
      saveToStorage({ customers: newCustomers, notes: state.notes });
      return { customers: newCustomers };
    });
  },

  getCustomer: (id) => {
    return get().customers.find((c) => c.id === id);
  },

  getNotesByCustomer: (customerId) => {
    return get()
      .notes.filter((n) => n.customerId === customerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  addNote: (customerId, data) => {
    const note: FollowupNote = {
      id: generateId(),
      customerId,
      content: data.content,
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
    return note;
  },

  searchFilter: (query, statusFilter) => {
    const { customers } = get();
    return customers.filter((c) => {
      const matchQuery = query.trim() === '' || c.name.toLowerCase().includes(query.trim().toLowerCase());
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchQuery && matchStatus;
    });
  },

  resetData: () => {
    saveToStorage(INITIAL_DATA);
    set({ customers: INITIAL_DATA.customers, notes: INITIAL_DATA.notes });
  },
}));
