import { format as formatter } from 'date-fns';

function format(date: Date, format: string) {
  return formatter(date, format);
}

const dateUtils = {
  format,
};

export default dateUtils;
