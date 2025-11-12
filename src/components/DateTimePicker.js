import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/pt-br';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

//Set Default Time zone to Brasil
dayjs.tz.setDefault('America/Sao_Paulo')

export default function DTPicker({ label, name, value, onChange }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <DateTimePicker
        label={label}
        value={value ? dayjs(value) : null}
         onChange={(newValue) => {
          const formatted = newValue
            ? newValue.format('YYYY-MM-DDTHH:mm:ss')
            : '';
          onChange({
            target: { name, value: formatted },
          });
        }}
        renderInput={(params) => <TextField {...params} fullWidth />}
      />
    </LocalizationProvider>
  );
}