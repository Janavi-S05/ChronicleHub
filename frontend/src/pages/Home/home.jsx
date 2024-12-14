import React from 'react'
import { useEffect, useState } from "react"
import Navbar from '../../components/Navbar'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance';
import BlogCard from '../../components/Cards/BlogCard';
import { MdAdd } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import Modal from "react-modal";
import 'react-toastify/dist/ReactToastify.css';
import { Edit } from '@material-ui/icons';
import AddEditBlog from './AddEditBlog';
import ViewBlog from './ViewBlog';
import EmptyCard from '../../components/Cards/EmptyCard';
import EmptyImg from "../../assets/empty.png";
import { DayPicker } from 'react-day-picker';
import momemt from "moment";
import "../../index.css";
import FilterInfoTitle from '../../components/Cards/FilterInfoTitle';
const Home = () => {

  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allBlogs, setAllBlogs] = useState([]);

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [dateRange, setDateRange] = useState({from:null,to:null});

  const [EditModal, setEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null
  });

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  }

  const getAllBlogs = async () => {
    try {
      const res = await axiosInstance.get("/allBlog");
      console.log("resultant data i home.jsx ", res.data);
      if (res.data && res.data.stories) {
        setAllBlogs(res.data.stories);
        // console.log(res.data.stories[2].imageUrl)
      }
    } catch (error) {
      console.log("An unexpected error occurred");
    }
  }


  const handleViewBlog = (data) => {
    setOpenViewModal({ isShown: true, data });
  }


  const handleEdit = (data) => {
    setEditModal({ isShown: true, type: "edit", data: data });

  }

  const updateIsFavourite = async (blogData) => {
    const blogId = blogData._id;

    try {
      const res = await axiosInstance.put(
        "/updateFav/" + blogId,
        {
          isFavourite: !blogData.isFavourite,
        }
      );
      console.log('Server Response:', res.data);
      if (res.data && res.data.story) {
        toast.success("Blog updated");
        getAllBlogs();
      }
    } catch (err) {
      console.log("An unexpected error occurred");
    }
  }

  const deleteBlog = async (data) => {
    const blogId = data._id;
    try {
      const res = await axiosInstance.delete("/deleteBlog/" + blogId);
      console.log(res);
      // if(!res.data && !res.data.error){
      toast.error("Blog deleted successfully");
      setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
      getAllBlogs();
      // }
    } catch (error) {

      console.log("An unexpected error occurred");
    }
  }
  useEffect(() => {
    getUserInfo();
    getAllBlogs();

    return () => { };
  }, []);

  const onSearchBlog = async (query) => {
    try {
      const res = await axiosInstance.get("/search", {
        params: {
          query,
        },
      });
      if (res.data && res.data.stories) {
        setFilterType("search");
        setAllBlogs(res.data.stories);
      }

    }catch(error){
      console.log("An unexpected error occurred");
    }
  }

  const handleClearSearch=()=>{
    setFilterType("");
    getAllBlogs();
  }
  const filterBlogByDate=async(day)=>{
    console.log(day);
    try{

      const startDate = day.from? new Date(day.from).getTime():null;
      const endDate = day.to?  new Date(day.to).getTime():null;

      console.log(startDate);
      console.log(endDate);
      if(startDate && endDate)
      {
        const res = await axiosInstance.get("/filter",{
          params:{startDate,endDate},
        });

        if(res.data && res.data.stories)
        {
          setFilterType("date");
          setAllBlogs(res.data.stories);
        }
      }
    }catch(error){
      console.log("An unexpected error occurred");
    }
  }

  const handleDayClick = (day)=>{
    console.log(day);
    setDateRange(day);
    filterBlogByDate(day);
  }

  const resetFilter=()=>{
    setDateRange({from:null,to:null});
    setFilterType("");
    getAllBlogs();
  }
  return (
    <>
      <Navbar
        userInfo={userInfo}
        search={search}
        setSearch={setSearch}
        onSearchBlog={onSearchBlog}
        handleClearSearch={handleClearSearch}
      />
      <div className='container mx-auto py-10'>
        <FilterInfoTitle
        filterType={filterType}
        filterDates={dateRange}
        onClear={()=>{
          resetFilter();
        }}
        />
        <div className='flex gap-7 mx-8'>
          <div className="flex-1">
            {allBlogs.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {allBlogs.map((item) => {
                  return (
                    <BlogCard
                      key={item._id}
                      imgUrl={item.imageUrl}
                      title={item.title}
                      story={item.story}
                      date={item.visitedDate}
                      visitedLocation={item.visitedLocation}
                      isFavourite={item.isFavourite}
                      onClick={() => handleViewBlog(item)}
                      onEdit={() => handleEdit(item)}
                      onFavouriteClick={() => updateIsFavourite(item)}
                    />
                  );
                })}
              </div>
            ) : (
              <EmptyCard imgSrc={EmptyImg} message="Your blog cart is waiting to be filled! Let’s change that—explore and add some great reads." />
            )}
          </div>
          <div className="w-[310px]">
            <div className="bg-white fixed border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
              <div className="p-0">
                <DayPicker
                  captionLayout='dropdown-buttons'
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDayClick}
                  pagedNavigation
                  styles={{
                    day_button: { fontSize:"medium" },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add and edit blog */}
      <Modal isOpen={EditModal.isShown}
        onRequestClose={() => { }}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <AddEditBlog
          type={EditModal.type}
          blogInfo={EditModal.data}
          onClose={() => {
            setEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllBlogs={getAllBlogs}
        />
      </Modal>

      {/* View blog story */}
      <Modal isOpen={openViewModal.isShown}
        onRequestClose={() => { }}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <ViewBlog
          blogInfo={openViewModal.data || null}
          onClose={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
          }}
          onEditClick={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
            handleEdit(openViewModal.data || null);
          }}
          onDeleteClick={() => {
            deleteBlog(openViewModal.data || null);
          }} />

      </Modal>

      <button
        className='w-11 h-11 flex items-center justify-center rounded-full bg-teal-500 hover:bg-teal-400 fixed right-10 bottom-10'
        onClick={() => {
          setEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[25px] text-white" />
      </button>
      <ToastContainer />
    </>
  )
}

export default Home