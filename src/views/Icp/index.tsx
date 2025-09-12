"use client";

import React from "react";
import GradientCard from "@/components/common/GradientCard";
import DocumentSelector from "@/components/common/documentSelector";

const Icp = () => {
  const handleSelection = (value: "yes" | "no") => {
    console.log("User selected:", value);
    // 👉 you can add navigation or conditional rendering here
  };

  return (
    <>
      {/* <GradientCard
        heading="ICP Document Generation"
        content="A comprehensive framework capturing all key elements requiered to execute a successfull go-to-market plan."
      /> */}

      {/* Document Selector Component */}
      <DocumentSelector onSelect={handleSelection} />
    </>
  );
};

export default Icp;
