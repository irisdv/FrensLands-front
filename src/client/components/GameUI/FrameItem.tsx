import React from "react";

export function FrameItem(props: any) {
  const { index, cost, inventory, option } = props;

  return (
    <div className="flex flex-row justify-center inline-block relative">
      <div
        className={"mb-3 small" + `${index}`}
        style={{ marginLeft: "-15px" }}
      ></div>
      <div
        className={`fontHPxl-sm ${
          option == 1 && inventory < cost ? "fontRed" : ""
        }`}
        style={{
          marginTop: "25px",
          marginLeft: "-20px",
        }}
      >
        {cost}
      </div>
    </div>
  );
}
