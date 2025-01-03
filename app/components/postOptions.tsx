"use client";

import Image from "next/image";
import Heart from "../svg/heart.svg";
import fill from "../svg/fillHeart.svg";
import { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../config";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

interface PostOptionsProps {
  postId?: number;
  Like: number;
  author: string;
}

export default function PostOptions({
  postId,
  Like,
  author,
}: PostOptionsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [admin, setAdmin] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const params = useParams();

  const route = useRouter();

  useEffect(() => {
    setCount(Like);
    setAdmin(localStorage.getItem("myName") == author ? true : false);
  }, [Like, author]);

  function like() {
    setCount(count + 1);
    setIsLiked(true);
    axios
      .post(
        `${url}/post/like?postId=${params.id}`,
        {
          likeClick: true,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setCount(res.data.likeCount);
      })
      .catch((err) => {
        setCount(count - 1);
        setIsLiked(false);
        console.log(err);
      });
  }

  function cancel() {
    setCount(count - 1);
    setIsLiked(false);
    axios
      .delete(`${url}/post/like/cancel?postId=${params.id}`, {
        data: {
          likeClick: false,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setCount(res.data.likeCount);
      })
      .catch((err) => {
        console.log(err);
        setCount(count + 1);
        setIsLiked(true);
      });
  }

  return (
    <div>
      <div
        style={{ border: "1px solid #A6A6A6" }}
        className="flex justify-between gap-6 m-4 items-center rounded-2xl px-2 mt-4 py-1 w-[20%]"
      >
        <div className="flex items-center">
          {!isLiked ? (
            <Image src={Heart} alt="빈 하트" onClick={like} />
          ) : (
            <Image src={fill} alt="하트" onClick={cancel} />
          )}
          <span>{count}</span>
        </div>
        {admin ? (
          <div className="cursor-pointer gap-2 items-center flex ">
            <button
              onClick={() => {
                axios
                  .delete(`${url}/post/delete?postId=${postId}`, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  })
                  .then(() => {
                    route.back();
                  });
              }}
            >
              삭제
            </button>
            <button
              onClick={() => {
                localStorage.setItem("postId", postId ? postId.toString() : "");
                route.push(`/editBlog`);
              }}
            >
              수정
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              axios
                .post(
                  `${url}/subs`,
                  {
                    name: author,
                    subClick: true,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                )

                .catch((err) => {
                  console.error(err);
                  setIsSubscribed(true);
                });
            }}
            className="cursor-pointer"
            disabled={!isSubscribed}
          >
            {isSubscribed ? "구독중" : "구독"}
          </button>
        )}
      </div>
    </div>
  );
}
