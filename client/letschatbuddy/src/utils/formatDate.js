import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import weekday from 'dayjs/plugin/weekday';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(weekday);
dayjs.extend(localizedFormat);

export function formatLastSeen(dateString) {
  if (!dateString) return 'Recently';

  const date = dayjs(dateString);

  if (date.isToday()) {
    return date.format('h:mm A');
  }

  if (date.isYesterday()) {
    return 'Yesterday';
  }

  if (dayjs().diff(date, 'day') <= 7) {
    return date.format('dddd'); 
  }

  return date.format('MMM D, YYYY');
}