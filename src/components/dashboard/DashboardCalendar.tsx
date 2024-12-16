"use client";

import { Group } from "@/types/group";
import { useState } from "react";
import React from "react";
import { MdChevronLeft, MdChevronRight, MdClose } from "react-icons/md";

interface DashboardCalendarProps {
  groups: Group[];
}

const DashboardCalendar = ({ groups }: DashboardCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const today = new Date();

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

  // 최대 표시할 일정 개수
  const MAX_VISIBLE_EVENTS = 2;

  // 모달 열기 함수
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
          {/* 모달 헤더 */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">
              {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월{" "}
              {selectedDate.getDate()}일 일정
            </h3>
            <button
              onClick={() => setShowModal(false)}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <MdClose className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* 모달 내용 */}
          <div className="px-6 py-4">
            {/* 시작하는 그룹 */}
            {starts.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  시작하는 그룹
                </h4>
                <div className="space-y-2">
                  {starts.map((group, idx) => (
                    <div
                      key={`modal-start-${idx}`}
                      className="flex items-center p-2 rounded-lg hover:bg-gray-50"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                      <span className="text-sm text-gray-800">
                        {group.name}
                      </span>
                    </div>
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
                    <div
                      key={`modal-end-${idx}`}
                      className="flex items-center p-2 rounded-lg hover:bg-gray-50"
                    >
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                      <span className="text-sm text-gray-800">
                        {group.name}
                      </span>
                    </div>
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

  return (
    <div className="flex flex-col h-screen w-full bg-[#F7F7F9]">
      <div className="mx-auto w-full px-2 sm:px-4 lg:px-8 py-4 sm:py-6 flex flex-col h-full">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 w-full h-full flex flex-col overflow-hidden">
          <div className="p-2 sm:p-4 flex flex-col h-full overflow-auto">
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-2 sm:mb-4 flex-shrink-0">
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
                  onClick={() =>
                    setCurrentDate(
                      new Date(currentDate.setMonth(currentDate.getMonth() - 1))
                    )
                  }
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
                          p-1 sm:p-2
                          rounded-md sm:rounded-lg 
                          transition-all duration-200 
                          flex flex-col
                          text-[10px] sm:text-xs md:text-sm
                          ${
                            date
                              ? "hover:bg-blue-50 cursor-pointer"
                              : "bg-gray-50"
                          }
                          ${dayIndex === 0 ? "text-red-500" : ""}
                          ${dayIndex === 6 ? "text-blue-500" : ""}
                          ${
                            isToday
                              ? "bg-blue-100 ring-1 sm:ring-2 ring-blue-400 font-bold"
                              : "border border-gray-100"
                          }
                        `}
                      >
                        {date && (
                          <>
                            <div
                              className={`
                              font-medium mb-0.5 sm:mb-1
                              ${isToday ? "text-blue-700" : ""}
                            `}
                            >
                              {date.getDate()}
                            </div>

                            {/* 그룹 일정 표시 */}
                            <div className="flex-1 min-h-0 overflow-hidden">
                              <div className="space-y-0.5 sm:space-y-1">
                                {(() => {
                                  const starts = getGroupsForDate(date).starts;
                                  const ends = getGroupsForDate(date).ends;
                                  const totalEvents =
                                    starts.length + ends.length;
                                  const visibleStarts = starts.slice(
                                    0,
                                    MAX_VISIBLE_EVENTS
                                  );
                                  const visibleEnds = ends.slice(
                                    0,
                                    Math.max(
                                      0,
                                      MAX_VISIBLE_EVENTS - visibleStarts.length
                                    )
                                  );

                                  return (
                                    <>
                                      {visibleStarts.map((group, idx) => (
                                        <div
                                          key={`start-${idx}`}
                                          className="flex items-center"
                                        >
                                          <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mr-1" />
                                          <span className="text-xs text-green-600 truncate">
                                            {group.name}
                                          </span>
                                        </div>
                                      ))}

                                      {visibleEnds.map((group, idx) => (
                                        <div
                                          key={`end-${idx}`}
                                          className="flex items-center"
                                        >
                                          <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mr-1" />
                                          <span className="text-xs text-red-600 truncate">
                                            {group.name}
                                          </span>
                                        </div>
                                      ))}

                                      {/* 추가 일정이 있는 경우 더보기 표시 */}
                                      {totalEvents > MAX_VISIBLE_EVENTS && (
                                        <button
                                          onClick={() => handleShowMore(date)}
                                          className="text-xs text-gray-500 hover:text-blue-600 mt-1 w-full text-left transition-colors"
                                        >
                                          +{totalEvents - MAX_VISIBLE_EVENTS}개
                                          더보기
                                        </button>
                                      )}
                                    </>
                                  );
                                })()}
                              </div>
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
