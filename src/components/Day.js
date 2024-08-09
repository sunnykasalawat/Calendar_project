import React, { useState, useEffect, useContext } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import GlobalContext from '../context/GlobalContext';

// Extend dayjs with the necessary plugins
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default function Day({ day, rowIdx }) {
  const [events, setEvents] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const {
    setDaySelected,
    setShowEventModal,
    setSelectedEvent,
  } = useContext(GlobalContext);

  useEffect(() => {
    fetchHolidays();
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/events');
      const data = await response.json();
      if (Array.isArray(data)) {
        setEvents(data);
      } else {
        console.error('Unexpected response format for events:', data);
        setEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    }
  };

  const fetchHolidays = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/holidays');
      const data = await response.json();
      if (Array.isArray(data)) {
        setHolidays(data);
      } else {
        console.error('Unexpected response format for holidays:', data);
        setHolidays([]);
      }
    } catch (error) {
      console.error('Error fetching holidays:', error);
      setHolidays([]);
    }
  };

  const eventsForDay = events.filter(event => {
    const startDate = dayjs(event.start_date);
    const endDate = dayjs(event.end_date);
    return dayjs(day).isSameOrAfter(startDate, 'day') && dayjs(day).isSameOrBefore(endDate, 'day');
  });

  const isHoliday = (date) => {
    return holidays.some(holiday => dayjs(date).isSame(dayjs(holiday.date), 'day'));
  };

  function getHolidayClass() {
    return isHoliday(day) ? "bg-yellow-400 text-black" : "";
  }

  function getCurrentDayClass() {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
      ? "bg-blue-600 text-white rounded-full w-7"
      : "";
  }

  return (
    <div className='border border-gray-200 flex flex-col'>
      <header className='flex flex-col items-center'>
        {rowIdx === 0 && (
          <p className='text-sm mt-1'>{day.format("ddd").toUpperCase()}</p>
        )}
        <p
          className={`text-sm p-1 my-1 text-center ${getHolidayClass()} ${getCurrentDayClass()}`}
        >
          {day.format("DD")}
        </p>
      </header>
      <div
        className="flex-1 cursor-pointer"
        onClick={() => {
          setDaySelected(day);
          setShowEventModal(true);
        }}
      >
        {holidays.filter(holiday => dayjs(day).isSame(dayjs(holiday.date), 'day')).map((holiday, idx) => (
          <div
            key={idx}
            style={{ backgroundColor: '#FFEB3B', color: '#000' }}
            className="bg-yellow-200 text-gray-800 p-2 mb-1 rounded-lg border shadow-md flex items-center justify-between backdrop-blur-sm"
          >
            <span className="text-sm font-semibold">{holiday.name}</span>
            <span className="text-xs text-gray-500">{dayjs(holiday.date).format("MMM DD")}</span>
          </div>
        ))}
        {eventsForDay.map((event, idx) => (
          <div
            key={idx}
            onClick={() => {
              setSelectedEvent(event);
              setShowEventModal(true);
            }}
            style={{ backgroundColor: '#BBDEFB', color: '#000' }}
            className="bg-blue-200 text-gray-800 p-2 mb-1 rounded-lg border shadow-md flex items-center justify-between backdrop-blur-sm"
          >
            <span className="text-sm font-semibold">{event.title}</span>
            <span className="text-xs text-gray-500">{dayjs(event.start_date).format("MMM DD")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
