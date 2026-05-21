// 台灣身分證字號驗證（含檢查碼）
const ID_LETTER_MAP: Record<string, number> = {
  A:10,B:11,C:12,D:13,E:14,F:15,G:16,H:17,I:34,J:18,
  K:19,L:20,M:21,N:22,O:35,P:23,Q:24,R:25,S:26,T:27,
  U:28,V:29,W:32,X:30,Y:31,Z:33,
};

export function validateTWID(value: string): boolean {
  const id = value.toUpperCase().trim();
  if (!/^[A-Z][12]\d{8}$/.test(id)) return false;
  const n = ID_LETTER_MAP[id[0]];
  const digits = [Math.floor(n / 10), n % 10, ...id.slice(1).split('').map(Number)];
  const weights = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1];
  return digits.reduce((sum, d, i) => sum + d * weights[i], 0) % 10 === 0;
}

// 台灣手機（09xxxxxxxx）或市話（02-8xxxxxxx 等）
export function validateTWPhone(value: string): boolean {
  const phone = value.replace(/[-\s]/g, '');
  return /^(09\d{8}|0[2-8]\d{7,8})$/.test(phone);
}

// Ant Design Form rule helpers
export const twIdRule = {
  validator: (_: unknown, value: string) => {
    if (!value) return Promise.resolve();
    return validateTWID(value)
      ? Promise.resolve()
      : Promise.reject(new Error('身分證字號格式不正確（需符合台灣身分證規則）'));
  },
};

export const twPhoneRule = {
  validator: (_: unknown, value: string) => {
    if (!value) return Promise.resolve();
    return validateTWPhone(value)
      ? Promise.resolve()
      : Promise.reject(new Error('電話格式不正確（手機 09xxxxxxxx 或市話 0x-xxxxxxxx）'));
  },
};
