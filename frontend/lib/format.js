export const money = (value) =>
  new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(value);

export const statusText = {
  pending_payment: 'รอชำระ',
  checking: 'กำลังตรวจสอบ',
  paid: 'ชำระสำเร็จ',
  cancelled: 'ยกเลิก'
};
