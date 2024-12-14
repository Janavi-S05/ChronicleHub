import moment from 'moment'
import React from 'react'
import { GrMapLocation } from 'react-icons/gr'
import { MdClose, MdDeleteOutline, MdUpdate } from 'react-icons/md'

const ViewBlog = ({ blogInfo, onClose, onEditClick, onDeleteClick }) => {
    console.log(blogInfo.imageUrl);
    return (
        <div className='relative'>
            <div className="flex items-center justify-end">
                <div>
                    <div className="flex items-center gap-3 bg-teal-50/50 p-2 rounded-l-lg">

                        <button className='btn-small' onClick={onEditClick}>
                            <MdUpdate className='text-lg' /> EDIT BLOG
                        </button>

                        <button className='btn-small btn-delete' onClick={onDeleteClick}>
                            <MdDeleteOutline className='text-lg' /> DELETE
                        </button>

                        <button className='btn-small' onClick={onClose}>
                            <MdClose className='text-xl text-slate-400 hover:text-white' />
                        </button>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex-1 flex flex-col gap-2 py-4">
                    <h1 className="text-2xl text-slate-950">
                        {blogInfo && blogInfo.title}
                    </h1>

                    <div className="flex items-center justify-between gap-3">
                        <span className="text-xs text-slate-500">
                            {blogInfo && moment(blogInfo.visitedDate).format("Do MMM YYYY")}
                        </span>

                        <div className="inline-flex items-center gap-2 text-[13px] bg-teal-200/40 rounded px-2 py-1">
                            <GrMapLocation className="text-sm bg-teal-200/40 text-teal-500" />
                            {blogInfo &&
                                blogInfo.visitedLocation.map((item, index) =>
                                    blogInfo.visitedLocation.length == index + 1
                                        ? `${item}` : `${item}, `)}
                        </div>
                    </div>

                </div>

                <img
                    src={blogInfo && blogInfo.imageUrl}
                    alt="Selected"
                    className="w-full h-[300px] object-cover rounded-lg"
                />

                <div className="mt-4">
                    <p className="text-sm text-slate-950 leading-6 text-justify whitespace-pre-line">{blogInfo.story}</p>
                </div>
            </div>
        </div>
    )
}

export default ViewBlog