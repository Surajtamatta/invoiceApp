
import React,{ useState,useEffect } from "react";
import {
  RiHome4Line,
  RiSettings5Line,
} from "react-icons/ri";
import {
  HiOutlineClock,
  HiArrowNarrowRight,
  HiArrowNarrowLeft,
} from "react-icons/hi";
import { MdOutlineReport} from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaFileInvoiceDollar } from "react-icons/fa";
import Link from "next/link";

const Sidebar= () => {
  
    const [collapsed, setCollapsed] = useState(false); // State for collapse status

    const toggleSidebar = () => {
      setCollapsed(!collapsed); // Toggle collapse state on click
    };
   
    useEffect(() => {
      const handleResize = () => setCollapsed(window.innerWidth <= 600);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []); 
    const sidebarStyles = {
        width: collapsed ? "60px" : (
          typeof window !== "undefined" && window.innerWidth <= 600
            ? "60px"
            : "250px"
        ),
        transition: "all 0.5s ease-in-out",
        '@media (maxWidth: 600px)': {
          width: collapsed ? "250px" : "60px",
        },
      };
      
    const textStyles = {
        display: collapsed ? "none" : "flex", // Hide text when collapsed
      };
  return (
    
      <div className="sidebar_container" style={sidebarStyles} >
        <div className="sidebar_logoWrapper">
        <div className="sidebar_text" style={textStyles}>
            Logo
        </div>
        </div>
        <div className="sidebar_nav">
            <Link href={'/'}>
              <div className="sidebar_list">
                  <div className="sidebar_styleIcon"><RiHome4Line/></div>
                  <h2 className="sidebar_text" style={textStyles}>Home</h2>
              </div>
            </Link>
            <Link href={'/'}>
            <div className="sidebar_list">
                <div className="sidebar_styleIcon"><FaFileInvoiceDollar/></div>
                <h2 className="sidebar_text" style={textStyles}>Invoices</h2>
            </div>
            </Link>
            
            <div className="sidebar_list">
                <div className="sidebar_styleIcon"><HiOutlineClock/></div>
                <h2 className="sidebar_text" style={textStyles}>History</h2>
            </div>
        

            <h1 className="sidebar_title"  >Others</h1>
            

            <div className="sidebar_list">
            <div className="sidebar_styleIcon"><IoPersonCircleOutline/></div>
                <h2 className="sidebar_text" style={textStyles}>Profile</h2>
            </div>
            <div className="sidebar_list">
            <div className="sidebar_styleIcon"><RiSettings5Line/></div>
                <h2 className="sidebar_text" style={textStyles}>Settings</h2>
            </div>
            
            <div className="sidebar_list">
            <div className="sidebar_styleIcon"><MdOutlineReport/></div>
                <h2 className="sidebar_text" style={textStyles}>Report</h2>
            </div>
            </div>
            <div className="sidebar_logOutWrapper">
            <div className="sidebar_styleIcon" onClick={toggleSidebar}>{collapsed ? <HiArrowNarrowRight /> : <HiArrowNarrowLeft />}</div>   
        </div>
       
      </div>
   
  );
}

export default Sidebar
