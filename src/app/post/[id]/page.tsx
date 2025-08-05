"use client";
import Card from "../../../components/Card";
import type { AxiosError, AxiosInstance } from "axios";
import { env } from "~/env";
import axios from "axios";
import { toast } from "sonner";
import { useState,useEffect } from "react";
interface PostProps {
  params: {
    id?: string;
  };
}


const Post = ({ params }: PostProps) => {

  const API: AxiosInstance = axios.create({
    baseURL: `${env.NEXT_PUBLIC_API_URL}`,
  });
  const [post,setPost]=useState();


  return (
    <div className="flex flex-col items-center justify-center">
      {params.id ? <div className="flex flex-col items-center justify-center">
        <div className="flex flex-row items-center justify-center">
            <div className="flex flex-col items-center justify-start">
                <button>Back</button>
            </div>
            <div className="flex flex-col items-start justify-center">
                
            </div>
        </div>
      </div>: <h1>No Post ID provided</h1>}
    </div>
  );
};

export default Post;
