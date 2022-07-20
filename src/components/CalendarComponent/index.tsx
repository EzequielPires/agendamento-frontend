import Calendar from "react-calendar";

export function CalendarComponent({ value, onChange }) {
    const now = new Date();
    const handleDaySchedules = async (date: Date) => {
        onChange(date);
    }

    return (
        <>
            {value && <Calendar
                onChange={handleDaySchedules}
                value={value}
                minDate={now}
            />
            }
        </>
    )
}