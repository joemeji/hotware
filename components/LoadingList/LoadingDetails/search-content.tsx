import { Search } from "lucide-react";
import React from "react";

export const SearchContent = () => {
  return (
    <div className="top-0 sticky z-10 inset-0 backdrop-blur-md p-3">
      <p className="font-medium text-lg mb-2">Loading Lists</p>
      <div className="bg-stone-100 flex items-center w-full rounded-app px-2 h-10 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background ring-offset-2 border border-input">
        <Search className="text-stone-400 w-5 h-5"/>
        <input type="search" placeholder="Search" 
        className="outline-none text-sm w-full px-2 bg-transparent h-full" />
      </div>
    </div>
  );
};