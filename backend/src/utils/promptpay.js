function crc16ccitt(input) {
  let crc = 0xffff;
  for (let i = 0; i < input.length; i += 1) {
    crc ^= input.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j += 1) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function field(id, value) {
  const stringValue = String(value);
  return `${id}${stringValue.length.toString().padStart(2, '0')}${stringValue}`;
}

function formatPromptPayId(id) {
  const digits = id.replace(/\D/g, '');
  if (digits.length === 10) return `0066${digits.slice(1)}`;
  return digits;
}

export function createPromptPayPayload(promptPayId, amount) {
  const target = field('00', 'A000000677010111') + field('01', formatPromptPayId(promptPayId));
  const payload =
    field('00', '01') +
    field('01', '12') +
    field('29', target) +
    field('53', '764') +
    field('54', Number(amount).toFixed(2)) +
    field('58', 'TH') +
    '6304';
  return `${payload}${crc16ccitt(payload)}`;
}
