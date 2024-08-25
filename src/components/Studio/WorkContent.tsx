import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { BookInfo } from "@/app/lib/definitions";
import { useUserInfo } from "../useUserInfo";
import { deleteBook, fetchBooksList } from "@/app/lib/action";
import Pagination from "../Pagination";
import Link from "next/link";

const ITEMS_PER_PAGE = 5;

const WorkContent: React.FC = () => {
  const router = useRouter();
  const { user } = useUserInfo();
  const [allBooks, setAllBooks] = useState<BookInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tabs = ["published", "ongoing", "completed", "draft"];
  const tabNames = ["已发布内容", "正在连载中", "已完结", "草稿箱"];

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [currentPage, setCurrentPage] = useState(1);

  const loadBooks = async () => {
    if (!user || !user.id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetchBooksList(user.id, 1, 1000, "all"); // 获取所有书籍

      if (response.code !== 200) {
        throw new Error(response.msg || "获取作品列表失败");
      }

      setAllBooks(response.data.dataList);
    } catch (err) {
      console.error("加载作品时出错:", err);
      setError(err instanceof Error ? err.message : "加载作品时发生未知错误");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, [user]);

  const filteredBooks = useMemo(() => {
    return allBooks.filter((book) => {
      switch (activeTab) {
        case "published":
          return book.publishStatus === "published";
        case "ongoing":
          return (
            book.status === "ongoing" && book.publishStatus === "published"
          );
        case "completed":
          return (
            book.status === "completed" && book.publishStatus === "published"
          );
        case "draft":
          return book.publishStatus === "draft";
        default:
          return false; // This should never happen
      }
    });
  }, [allBooks, activeTab]);

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setCurrentPage(1); // 重置页码到第一页
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleNewWork = () => {
    router.push("/writing");
  };

  const handleEdit = (bookId: number) => {
    router.push(`/writing/${bookId}`);
  };

  const handleDelete = async (bookId: number) => {
    if (window.confirm("确定要删除这个作品吗？")) {
      try {
        const response = await deleteBook(bookId);
        if (response.code === 200) {
          loadBooks(); // 重新加载所有书籍
        } else {
          throw new Error(response.msg || "Failed to delete work");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete work");
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-10">
      <ul className="flex text-lg border-b">
        {tabs.map((tab, index) => (
          <li
            key={tab}
            className={`px-6 py-3 cursor-pointer transition-colors duration-200 
              ${
                activeTab === tab
                  ? "border-b-2 border-orange-400 text-orange-600"
                  : "text-neutral-500 hover:text-orange-400"
              }`}
            onClick={() => handleTabChange(tab)}
          >
            {tabNames[index]}
          </li>
        ))}
      </ul>
      <div className="mt-6">
        {loading ? (
          <p className="text-center py-4">加载中...</p>
        ) : error ? (
          <p className="text-center py-4 text-red-500">错误: {error}</p>
        ) : (
          <div>
            <div className="grid grid-cols-8  text-center text-neutral-600 bg-neutral-50 font-semibold ">
              <div className="p-3 col-span-3 ">标题</div>
              <div className="p-3 col-span-1">状态</div>
              <div className="p-3 col-span-2">最后更新</div>
              <div className="p-3 col-span-1">操作</div>
            </div>
            <ul className=" h-64 ">
              {paginatedBooks.map((book: BookInfo) => (
                <li
                  key={book.id}
                  className="grid grid-cols-8 items-center border-b border-neutral-100 hover:bg-neutral-50 transition-colors duration-150"
                >
                  <Link
                    href={`/book/${book.id}`}
                    className="col-span-6 grid grid-cols-6 items-center py-3 px-3"
                  >
                    <span className="col-span-3  font-medium text-neutral-600">
                      {book.title}
                    </span>
                    <span className="col-span-1 text-sm  text-center mx-5 text-neutral-500">
                      {book.publishStatus === "published"
                        ? book.status === "ongoing"
                          ? "连载中"
                          : "已完结"
                        : "草稿"}
                    </span>
                    <span className="text-sm col-span-2 text-center  text-neutral-500">
                      {book.lastSaved}
                    </span>
                  </Link>
                  <div className="flex justify-center items-center  ">
                    <button
                      className="text-orange-400 hover:text-orange-500 transition-colors duration-150"
                      onClick={(e) => {
                        e.preventDefault();
                        handleEdit(book.id);
                      }}
                    >
                      編輯
                    </button>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-600 transition-colors duration-150"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(book.id);
                    }}
                  >
                    刪除
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex justify-between items-center mt-6">
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            onClick={handleNewWork}
          >
            新增作品
          </button>
        </div>
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkContent;
