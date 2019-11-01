import * as React from "react";

export const App = () => (
  <div className="h-screen flex items-center justify-center">
    <div className="flex items-center justify-center border p-5 shadow-xl rounded">
      <div className="pr-5 text-4xl">👋</div>
      <div className="flex items-center justify-center flex-col border-l pl-5">
        <h1 className="text-2xl">Hello world!</h1>
        <p className="text-gray-600">This is a webpage</p>
      </div>
    </div>
  </div>
);
