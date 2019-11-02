import * as React from "react";

export const Section: React.FC<{
  title: React.ReactNode;
  description: JSX.Element;
}> = ({ title, description, children }) => {
  const [showInfo, setShowInfo] = React.useState(false);
  return (
    <section className="flex flex-col mt-3">
      <div className="border-b flex items-baseline px-2">
        <h3 className="text-xl flex-1">{title}</h3>
        <a
          className="text-gray-600 underline hover:text-gray-400"
          href="#"
          onClick={e => {
            e.preventDefault();
            setShowInfo(!showInfo);
          }}
        >
          {showInfo ? "Hide" : "Show"} info
        </a>
      </div>
      {showInfo ? <p className="text-gray-500 mx-2">{description}</p> : null}
      <div className="flex flex-col mt-6">{children}</div>
    </section>
  );
};
