import Header from "@/components/Header";
import Section from "@/components/Section";
import Sidebar from "@/components/Sidebar";
import Comments from "@/components/comments/Comments";
import React from "react";

const Home = () => {
  return (
    <div className="">
      <div className=" m-auto  ">
        <Header />
        <div className="flex bg-custom3">
          <div className="w-4/5 flex m-auto">
            <Sidebar />
            <Section />
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Home;
