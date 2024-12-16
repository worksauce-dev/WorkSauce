"use client";

import { Group } from "@/types/group";
import { useState } from "react";
import React from "react";
import { MdChevronLeft, MdChevronRight, MdClose } from "react-icons/md";
import Link from "next/link";

interface DashboardCalendarProps {
  groups: Group[];
}

const DashboardCalendar = ({ groups }: DashboardCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const today = new Date();

  const MAX_VISIBLE_EVENTS = 2;

  const COLORS = [
    {
      bg: "bg-blue-100",
      text: "text-blue-700",
      hover: "hover:bg-blue-200",
    },
    {
      bg: "bg-purple-100",
      text: "text-purple-700",
      hover: "hover:bg-purple-200",
    },
    {
      bg: "bg-green-100",
      text: "text-green-700",
      hover: "hover:bg-green-200",
    },
    {
      bg: "bg-orange-100",
      text: "text-orange-700",
      hover: "hover:bg-orange-200",
    },
    {
      bg: "bg-pink-100",
      text: "text-pink-700",
      hover: "hover:bg-pink-200",
    },
  ];

  const getGroupColor = (groupId: string) => {
    if (!groupId) return COLORS[0];

    const hash = groupId.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const index = Math.abs(hash) % COLORS.length;
    return COLORS[index];
  };

  // 날짜별 그룹 일정을 찾는 함수
  const getGroupsForDate = (date: Date) => {
    if (!date) return { starts: [], ends: [] };

    const dateStr = date.toISOString().split("T")[0];

    return {
      starts: groups.filter(group => group.createdAt.split("T")[0] === dateStr),
      ends: groups.filter(group => group.deadline.split("T")[0] === dateStr),
    };
  };

  // 달력 날짜 생성 함수
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const calendar = [];
    let day = 1;

    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startingDay) {
          week.push(null);
        } else if (day > daysInMonth) {
          week.push(null);
        } else {
          week.push(new Date(year, month, day));
          day++;
        }
      }
      calendar.push(week);
    }

    return calendar;
  };

  const calendar = getDaysInMonth(currentDate);
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  // 대달 열기 함수
  const handleShowMore = (date: Date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  // 모달 컴포넌트
  const EventModal = () => {
    if (!selectedDate) return null;

    const { starts, ends } = getGroupsForDate(selectedDate);

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={() => setShowModal(false)}
      >
        <div
          className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="modal-header bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-t-xl">
            <h3 className="text-lg font-semibold">
              {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월{" "}
              {selectedDate.getDate()}일
            </h3>
          </div>

          <div className="px-6 py-4">
            {/* 시작하는 그룹 */}
            {starts.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  시작하는 그룹
                </h4>
                <div className="space-y-2">
                  {starts.map((group, idx) => (
                    <Link
                      key={`modal-start-${idx}`}
                      href={`/group/${group.groupId}`}
                      className="flex items-center p-2 rounded-lg hover:bg-gray-50 w-full transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                      <span className="text-sm text-gray-800">
                        {group.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 마감되는 그룹 */}
            {ends.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  마감되는 그룹
                </h4>
                <div className="space-y-2">
                  {ends.map((group, idx) => (
                    <Link
                      key={`modal-end-${idx}`}
                      href={`/group/${group.groupId}`}
                      className="flex items-center p-2 rounded-lg hover:bg-gray-50 w-full transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                      <span className="text-sm text-gray-800">
                        {group.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {starts.length === 0 && ends.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                일정이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 1. 이벤트 표시 개선
  const EventIndicator = ({
    group,
    type,
  }: {
    group: Group;
    type: "start" | "end";
  }) => {
    const color = getGroupColor(group.groupId);
    return (
      <Link
        href={`/group/${group.groupId}`}
        className={`
          ${color.bg} ${color.text}
          px-2 py-0.5 rounded-full
          flex items-center gap-1
          text-[8px] sm:text-[10px]
          font-medium
          ${color.hover}
          transition-colors
          w-full
          cursor-pointer
        `}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            type === "start" ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span className="truncate">{group.name}</span>
      </Link>
    );
  };

  // 1. 날짜 이동 로직 개선
  const moveMonth = (direction: "prev" | "next") => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === "prev" ? -1 : 1));
      return newDate;
    });
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#F7F7F9]">
      <div className="mx-auto w-full px-2 sm:px-4 lg:px-8 py-4 sm:py-6 flex flex-col h-full">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 w-full h-full flex flex-col overflow-hidden">
          <div className="p-2 sm:p-4 flex flex-col h-full overflow-auto">
            {/* Calendar Header */}
            <div
              className="flex justify-between items-center mb-2 sm:mb-4 flex-shrink-0"
              tabIndex={0}
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
              </h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-2 py-1 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-all duration-200 border border-gray-200"
                >
                  오늘
                </button>
                <button
                  aria-label="이전 달로 이동"
                  onClick={() => moveMonth("prev")}
                  className="p-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-all duration-200"
                >
                  <MdChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setCurrentDate(
                      new Date(currentDate.setMonth(currentDate.getMonth() + 1))
                    )
                  }
                  className="p-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-all duration-200"
                >
                  <MdChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Week days header - 더 얇게 수정 */}
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-0.5 sm:mb-1 flex-shrink-0">
              {weekDays.map((day, index) => (
                <div
                  key={day}
                  className={`text-center py-1 text-[10px] sm:text-xs font-medium ${
                    index === 0
                      ? "text-red-500"
                      : index === 6
                      ? "text-blue-500"
                      : "text-gray-400"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1 flex-1 auto-rows-fr min-h-0">
              {calendar.map((week, weekIndex) => (
                <React.Fragment key={weekIndex}>
                  {week.map((date, dayIndex) => {
                    const isToday =
                      date &&
                      date.getDate() === today.getDate() &&
                      date.getMonth() === today.getMonth() &&
                      date.getFullYear() === today.getFullYear();

                    return (
                      <div
                        key={dayIndex}
                        className={`
                          relative
                          p-1 sm:p-2
                          rounded-lg
                          transition-all duration-200
                          flex flex-col
                          hover:shadow-md
                          hover:border-blue-200
                          ${
                            isToday
                              ? "bg-blue-50 ring-2 ring-blue-400"
                              : "bg-white border border-gray-100"
                          }
                        `}
                      >
                        {date && (
                          <>
                            <div
                              className={`font-medium mb-0.5 sm:mb-1 ${
                                isToday ? "text-blue-700" : ""
                              }`}
                            >
                              {date.getDate()}
                            </div>

                            {/* 그룹 일정 표시 */}
                            <div className="space-y-0.5 flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
                              {(() => {
                                const { starts, ends } = getGroupsForDate(date);
                                const totalEvents = starts.length + ends.length;
                                const visibleStarts = starts.slice(
                                  0,
                                  MAX_VISIBLE_EVENTS
                                );
                                const visibleEnds = ends.slice(
                                  0,
                                  MAX_VISIBLE_EVENTS - visibleStarts.length
                                );
                                const remainingCount =
                                  totalEvents -
                                  (visibleStarts.length + visibleEnds.length);

                                return (
                                  <>
                                    {/* 시작하는 그룹 */}
                                    {visibleStarts.map((group, idx) => (
                                      <div key={`start-${idx}`}>
                                        <EventIndicator
                                          group={group}
                                          type="start"
                                        />
                                      </div>
                                    ))}

                                    {/* 마감되는 그룹 */}
                                    {visibleEnds.map((group, idx) => (
                                      <div key={`end-${idx}`}>
                                        <EventIndicator
                                          group={group}
                                          type="end"
                                        />
                                      </div>
                                    ))}

                                    {/* 추가 일정이 있는 경우 더보기 표시 */}
                                    {remainingCount > 0 && (
                                      <button
                                        onClick={() => handleShowMore(date)}
                                        className="text-[8px] sm:text-[10px] text-gray-500 hover:text-blue-600 w-full text-left transition-colors"
                                      >
                                        +{remainingCount}개 더보기
                                      </button>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
      {showModal && <EventModal />}
    </div>
  );
};

export default DashboardCalendar;
