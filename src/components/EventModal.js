import React, { useContext, useState } from 'react';
import { ReactMultiEmail } from 'react-multi-email';
import GlobalContext from '../context/GlobalContext';

export default function EventModal() {
  const today = new Date().toISOString().split('T')[0];
  const { setShowEventModal, dispatchCalEvent, selectedEvent, refreshEvents } = useContext(GlobalContext);
  const [title, setTitle] = useState(selectedEvent ? selectedEvent.title : '');
  const [description, setDescription] = useState(selectedEvent ? selectedEvent.description : '');
  const [startdate, setStartdate] = useState(selectedEvent ? selectedEvent.start_date : '');
  const [enddate, setEnddate] = useState(selectedEvent ? selectedEvent.end_date : '');
  const [emails, setEmails] = useState(selectedEvent ? selectedEvent.emails.split(',') : []);
  const [focused, setFocused] = useState(false);

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const calendarEvent = {
      title,
      description,
      start_date: startdate,
      end_date: enddate,
      emails: emails.join(',')
    };

    const method = selectedEvent && selectedEvent.sn ? 'PUT' : 'POST';
    const url = method === 'PUT'
      ? `https://calendar-backend-1.onrender.com/api/events/${selectedEvent.sn}`
      : 'https://calendar-backend-1.onrender.com/api/events';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(calendarEvent),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData.error);
        alert('Failed to save event. Please try again.');
        return;
      }

      const result = await response.json();
 

      if (method === 'PUT') {
        dispatchCalEvent({ type: 'update', payload: { ...calendarEvent, id: selectedEvent.sn } });
      } else {
        dispatchCalEvent({ type: 'push', payload: result.event });
      }

      setShowEventModal(false);
      window.location.reload();
    } catch (error) {
      alert('Failed to save event. Please try again.', error);
    }
  };


  const handleDelete = async () => {
    if (!selectedEvent || !selectedEvent.sn) return;

    try {
      const response = await fetch(`https://calendar-backend-1.onrender.com/api/events/${selectedEvent.sn}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData.error);
        alert('Failed to delete event. Please try again.');
        return;
      }

      dispatchCalEvent({ type: 'delete', payload: selectedEvent });
      setShowEventModal(false);
      window.location.reload();

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete event. Please try again.');
    }

  };




  return (
    <div className="h-screen w-full fixed left-0 top-0 flex justify-center items-center">
      <form className="bg-white rounded-lg shadow-2xl w-1/4">
        <header className="bg-gray-100 px-4 py-2 flex justify-between items-center">
          <span className="material-icons-outlined text-gray-400">
            drag_handle
          </span>
          <div>
            {selectedEvent && (
              <span
                onClick={handleDelete}
                className="material-icons-outlined text-gray-400 cursor-pointer"
              >
                delete
              </span>
            )}
            <button onClick={() => setShowEventModal(false)}>
              <span className="material-icons-outlined text-gray-400">close</span>
            </button>
          </div>
        </header>
        <div className="p-3">
          <div className="grid grid-cols-1/5 items-end gap-y-7">
            <div></div>
            <input
              type="text"
              name="title"
              placeholder="Add title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="pt-3 border-0 text-gray-600 text-xl font-semibold pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
              required
            />
            <input
              type="text"
              name="description"
              placeholder="Add description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="pt-3 border-0 text-gray-600 text-sm pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
            />
            <input
              type="date"
              name="start_date"
              value={startdate}
              onChange={(e) => setStartdate(e.target.value)}
              className="border-0 text-gray-600 pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
              min={today}
              required
            />
            <input
              type="date"
              name="end_date"
              value={enddate}
              onChange={(e) => setEnddate(e.target.value)}
              className="border-0 text-gray-600 pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
              min={today}
              required
            />
            <ReactMultiEmail
              emails={emails}
              onChange={setEmails}
              autoFocus={focused}
              className="border-0 text-gray-600 pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              getLabel={(email, index, removeEmail) => {
                return (
                  <div data-tag key={index} className="border-0 text-gray-600 pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500">
                    {email}
                    <span data-tag-handle onClick={() => removeEmail(index)}>
                      ×
                    </span>
                  </div>
                );
              }}
            />
          </div>
        </div>
        <footer className="flex justify-end border-t p-3 mt-5">
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded text-white"
          >
            Save
          </button>
        </footer>
      </form>
    </div>
  );
}
