import React from 'react'
import { useState } from 'react'
import { format } from 'date-fns';
import { MdClose, MdOutlineDateRange } from 'react-icons/md';
import {DayPicker} from "react-day-picker";
import moment from 'moment';

const DateSelector = ({date, setDate}) => {

  const [datePicker,setDatePicker] = useState(false); 

  return (
    <div>
        <button className="inline-flex items-center gap-2 text-[13px] font-medium text-teal-600 bg-teal-200/40 hover:bg-teal-200/70 rounded px-2 py-1 cursor-pointer"
        onClick={()=>{
            setDatePicker(true);
        }}>
            <MdOutlineDateRange className='text-lg'/>
            {date ? format(date, 'do MMM yyyy') : format(new Date(), 'do MMM yyyy')
            }
        </button>

        { datePicker && <div className="overflow-y scroll p-5 bg-teal-50/80 rounded-lg relative pt-9">
          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-teal-100 hover:bg-teal-100 absolute top-2 right-2" onClick={()=>{
            setDatePicker(false);
          }}>
            <MdClose className='text-xl text-teal-600'/>
          </button>
          <DayPicker captionLayout="dropdown-buttons"
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            setDate(selectedDate || new Date());
            setDatePicker(false);}}
          pagedNavigation
          />
        </div>}
    </div>
  )
}

export default DateSelector