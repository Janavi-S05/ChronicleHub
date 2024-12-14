import React from 'react'
import moment from "moment";
import {MdOutlineClose} from "react-icons/md";
const FilterInfoTitle = ({ filterType,filterDates,onClear }) => {
    
    const DateRangeChip = ({date})=>{
        const start = date?.from
        ? moment(date?.from).format("Do MMM YYYY")
        : "N/A";

        const end = date?.to
        ? moment(date?.to).format("Do MMM YYYY")
        : "N/A";
        console.log(start);
        console.log(end);
        return (
            <div className="flex items-center gap-2 text-teal-600 bg-slate-200 px-3 py-2 rounded">
                <p className="text-xs font-medium">
                    {start} - {end}
                </p>
                <button onClick={onClear}>
                    <MdOutlineClose/>
                </button>
            </div>
        )
    }
    return (
        filterType && (
            <div className='mb-5'>
                {filterType === "search" ? (
                    <h3 className='text-lg font-medium pl-10 text-slate-700'>Search Results</h3>
                ) : (
                    <div className='flex items-center gap-2 pl-10'>
                        <h3 className='text-lg font-medium text-slate-700'>Blog from</h3>
                        <DateRangeChip date={filterDates} />

                    </div>
                )}
            </div>
        )
    );
}

export default FilterInfoTitle