import React from "react";

function Footer() {
  return (
    <div className="mt-2 py-6 flex justify-center bg-[#212124]">
      <div className="flex flex-col items-center space-y-10">
        <div className="w-[400px] flex items-center gap-2 font-medium">
          <div className="cursor-pointer font-bold text-lg duration-150 hover:scale-105 hover:text-rose-500 text-blue-600">BookWorm.com</div>
          <div className="h-full w-1 rounded-full bg-slate-400"></div>
          <div className="text-rose-500"><span className="font-normal text-slate-400">Made by </span><span className="text-[#4cfc29]"><a href="https://wa.me/+917003378772">Arpan Ghosh</a>,</span> <a href="https://wa.me/+919674630806">Ankita De</a>, <a href="https://wa.me/+919101375308">Dipika Mondal</a>, <a href="https://wa.me/+917439455593">Ishani Dhar</a></div>
        </div>
        <div className="font-[Poppins] font-medium text-slate-500">
          <span>Copyright &#169; 2023 BookWorm.com | All Rights Reserved.</span>
        </div>
      </div>
    </div>
  );
}

export default Footer;
