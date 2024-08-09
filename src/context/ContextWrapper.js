import React, {
    useState,
    useEffect,
    useReducer,
    useMemo,
  } from "react";
import GlobalContext from "./GlobalContext";
import dayjs from "dayjs";


function savedEventsReducer(state, { type, payload }) {
    switch (type) {
      case "push":
        return [...state, payload];
      case "update":
        return state.map((evt) =>
          evt.sn === payload.sn ? payload : evt
        );
      case "delete":
        return state.filter((evt) => evt.sn !== payload.sn);
      default:
        throw new Error(`Unknown action type: ${type}`);
    }
  }


  function initEvents() {
    const storageEvents = localStorage.getItem("savedEvents");
    const parsedEvents = storageEvents ? JSON.parse(storageEvents) : [];
    return parsedEvents;
  }

export default function ContextWrapper(props){
    const [monthIndex, setMonthIndex] = useState(dayjs().month());
    const [showEventModal, setShowEventModal] = useState(false);
    const [daySelected, setDaySelected] = useState(dayjs());
    const [savedEvents, dispatchCalEvent] = useReducer(
        savedEventsReducer,
        [],
        initEvents
      );
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        if (!showEventModal) {
          setSelectedEvent(null);
        }
      }, [showEventModal]);


    return(
    <GlobalContext.Provider 
        value={{
        monthIndex,
        setMonthIndex,
        daySelected,
        setDaySelected,
        showEventModal,
        setShowEventModal,
        dispatchCalEvent,
        selectedEvent,
        setSelectedEvent,
    }}>
        {props.children}
    </GlobalContext.Provider>
    );
}