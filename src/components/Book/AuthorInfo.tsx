import React from "react";
import { CreatorUserInfo } from "@/app/lib/definitions";

interface AuthorInfoProps {
  author: CreatorUserInfo;
}

export const AuthorInfo: React.FC<AuthorInfoProps> = ({ author }) => (
  <div className="w-80 border-l border-gray-100 flex flex-col items-center justify-around">
    <div className="w-10 h-10 rounded-full bg-slate-400"></div>
    <p>{author.displayName || "作者暱稱"}</p>
    <p>{author.introduction || "作者簡介..."}</p>
    <button className="hover:bg-orange-500 bg-orange-400 px-5 py-2 rounded text-white">
      关注
    </button>
  </div>
);

export default AuthorInfo;
