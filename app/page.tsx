"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import "../app/globals.css";
import Header from "./components/header";
import Post from "./components/post";
import PostProps from "./type/type";
import { url } from "../config";
import Button from "./components/button";
import Sub from "./components/sub";
import Lank from "./components/lank";

export default function Home() {
  const [posts, setPosts] = useState<PostProps[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${url}/main`);
        setPosts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, []);
  const example = {
    postId: 1,
    title: "하이티비",
    author: "배경진",
    view: 4,
    createdAt: "1일 전",
    sub: 3,
    like: 2,
  };
  return (
    <div>
      <Header />
      <div className="flex px-6 py-4">
        <div className="flex flex-col gap-5 w-2/3">
          {posts.map((post) => (
            <Post key={post.postId} post={post} />
          ))}
          <Lank post={example} />
          <Lank post={example} />
          <Lank post={example} />
          <Lank post={example} />
        </div>
        <div className="flex flex-col items-left border-l border-gray1">
          <div className="flex flex-col">
            <h4 className="text-xs text-left">
              gistory에 로그인하여 블로그를 즐겨보아요
            </h4>
            <Button label="로그인" />
            <Button label="회원가입" />
          </div>
          <div className="mt-10 flex flex-col gap-5">
            <h2 className="font-extrabold text-[20px]">구독자 왕👑</h2>
            <Sub />
            <Post post={example} />
          </div>
        </div>
      </div>
    </div>
  );
}
