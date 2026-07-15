export const TZ = 'Asia/Kolkata';

export interface ISTParts {
  weekday: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  dateId: string;
  timeText: string;
}

export function istParts(date = new Date()): ISTParts {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).map(part => [part.type, part.value]));
  const hour = parts.hour === '24' ? '00' : parts.hour;
  return {
    weekday: parts.weekday,
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
    dateId: `${parts.year}-${parts.month}-${parts.day}`,
    timeText: `${hour}:${parts.minute}:${parts.second} IST`
  };
}

export function todayId(): string {
  return istParts().dateId;
}

export function istDateText(date = new Date()): string {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: TZ,
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

export function addDays(dateId: string, delta: number): string {
  const [year, month, day] = dateId.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day + delta, 12)).toISOString().slice(0, 10);
}

export function dateLabel(dateId: string, options: { month?: 'short' | 'long'; weekday?: 'short' | 'long'; year?: 'numeric' | '2-digit' } = {}): string {
  const [year, month, day] = dateId.split('-').map(Number);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: options.month || 'short',
    weekday: options.weekday,
    year: options.year
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}

export function nextISTResetMs(): number {
  const p = istParts();
  return Date.UTC(p.year, p.month - 1, p.day + 1, -5, -30, 0);
}

export function formatDuration(ms: number, compact = false): string {
  let seconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;
  if (compact) return hours ? `${hours}h ${minutes}m ${seconds}s` : `${minutes}m ${seconds}s`;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function formatMinutes(value: number): string {
  const total = Math.round(Number(value) || 0);
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (!hours) return `${minutes}m`;
  return `${hours}h${minutes ? ` ${minutes}m` : ''}`;
}

export function titleCase(value: string): string {
  return String(value || '').replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

export function deadlineParts(deadlineISO: string) {
  const [date, rest = '09:00'] = (deadlineISO || '2027-01-15T09:00:00+05:30').split('T');
  return { date, time: rest.slice(0, 5) };
}

export function buildDeadlineISO(date: string, time: string): string {
  return `${date}T${time || '09:00'}:00+05:30`;
}

export function deadlineLeft(deadlineISO: string) {
  const targetMs = new Date(deadlineISO).getTime();
  const ms = Math.max(0, targetMs - Date.now());
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms % 86400000) / 3600000),
    minutes: Math.floor((ms % 3600000) / 60000),
    seconds: Math.floor((ms % 60000) / 1000)
  };
}

export function deadlineText(deadlineISO: string): string {
  const left = deadlineLeft(deadlineISO);
  return `${left.days}d ${left.hours}h ${left.minutes}m ${left.seconds}s`;
}
