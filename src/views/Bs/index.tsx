"use client";

import React, { useState } from "react";
import DocumentSelector from "@/components/common/documentSelector";
import UploadDocument from "@/components/common/UploadDocument";
import GradientCard from "@/components/common/GradientCard";

const Bs = () => {
  const [selection, setSelection] = useState<"yes" | "no" | null>(null);

  const handleSelection = (value: "yes" | "no") => {
    setSelection(value);
    console.log("User selected:", value);
  };

  return (
    <>

      <GradientCard
        heading="BS Document Generation"
        content="A comprehensive framework capturing all key elements required to execute a successful go-to-market plan."
      />


      {selection === null && (
        <DocumentSelector onSelect={handleSelection} />
      )}

      {selection === "yes" && <UploadDocument />}

      {selection === "no" && (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1.2rem",
            fontWeight: "500",
          }}
        >
          You selected <strong>No</strong>.
        </div>
      )}
    </>
  );
};

export default Bs;
