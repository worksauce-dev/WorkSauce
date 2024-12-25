"use client";

import { Contact, ContactGroup } from "@/types/contacts";
import { useState, useEffect } from "react";
import { isValidEmail } from "@/utils/isValidEmail";

interface ContactDetailProps {
  contact: Contact | null;
  groups: ContactGroup[];
  onUpdateContact: (
    contactId: string,
    updateData: Partial<Contact>
  ) => Promise<void>;
  onMoveToGroup: (contactId: string, groupId: string | null) => Promise<void>;
}

const ContactDetail = ({
  contact,
  groups,
  onUpdateContact,
  onMoveToGroup,
}: ContactDetailProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Contact>>({});
  const [emailError, setEmailError] = useState<string>("");
  const [localContact, setLocalContact] = useState<Contact | null>(contact);

  useEffect(() => {
    setLocalContact(contact);
  }, [contact]);

  useEffect(() => {
    if (contact) {
      setEditData({
        name: contact.name,
        email: contact.email,
        memo: contact.memo,
      });
    }
  }, [contact]);

  if (!localContact) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <p className="text-lg font-medium">선택된 연락처가 없습니다</p>
          <p className="text-sm mt-1">왼쪽 목록에서 연락처를 선택해주세요</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (editData.email && !isValidEmail(editData.email)) {
      setEmailError("올바른 이메일 형식��� 입력해주세요.");
      return;
    }

    if (editData.name?.trim() && localContact) {
      try {
        // 낙관적 업데이트
        setLocalContact({
          ...localContact,
          ...editData,
        });

        // 서버에 변경사항 전송
        await onUpdateContact(localContact.id, editData);
        setIsEditing(false);
        setEmailError("");
      } catch (error) {
        // 서버 요청 실패 시 원래 상태로 복구
        setLocalContact(contact);
        alert("저장에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleMoveToGroup = async (groupId: string | null) => {
    if (localContact) {
      try {
        // 낙관적 업데이트
        setLocalContact({
          ...localContact,
          groupId: groupId,
        });

        // 서버에 변경사항 전송
        await onMoveToGroup(localContact.id, groupId);
      } catch (error) {
        // 서버 요청 실패 시 원래 상태로 복구
        setLocalContact(contact);
        alert("그룹 변경에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEditData({ ...editData, email: newEmail });
    if (!newEmail || isValidEmail(newEmail)) {
      setEmailError("");
    }
  };

  return (
    <div className="space-y-8 p-1">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">연락처 상세</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 
            ${
              isEditing
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "text-blue-600 hover:bg-blue-50"
            }`}
        >
          {isEditing ? "취소" : "수정"}
        </button>
      </div>

      <div className="space-y-6">
        {/* 이름 필드 */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이름
          </label>
          <div className="relative">
            {isEditing ? (
              <input
                type="text"
                value={editData.name || ""}
                onChange={e =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="block w-full p-[9px] text-sm text-gray-900 rounded-lg bg-gray-50
                  border border-gray-200 hover:border-gray-300 transition-all duration-200
                  focus:border-blue-500 focus:bg-white outline-none"
                placeholder="이름을 입력하세요"
                autoFocus
              />
            ) : (
              <div
                className="block w-full p-[9px] text-sm text-gray-900 rounded-lg bg-gray-50
                border border-transparent transition-all duration-200"
              >
                {localContact.name}
              </div>
            )}
          </div>
        </div>

        {/* 이메일 필드 */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이메일
          </label>
          <div className="relative">
            {isEditing ? (
              <>
                <input
                  type="email"
                  value={editData.email || ""}
                  onChange={handleEmailChange}
                  className={`block w-full p-[9px] text-sm text-gray-900 rounded-lg bg-gray-50
                    border ${emailError ? "border-red-500" : "border-gray-200"} 
                    hover:border-gray-300 transition-all duration-200
                    focus:border-blue-500 focus:bg-white outline-none`}
                  placeholder="이메일을 입력하세요"
                />
                {emailError && (
                  <p className="mt-1 text-xs text-red-500">{emailError}</p>
                )}
              </>
            ) : (
              <div
                className="block w-full p-[9px] text-sm text-gray-900 rounded-lg bg-gray-50
                border border-transparent transition-all duration-200"
              >
                {localContact.email || "-"}
              </div>
            )}
          </div>
        </div>

        {/* 메모 필드 */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            메모
          </label>
          <div className="relative">
            {isEditing ? (
              <textarea
                value={editData.memo || ""}
                onChange={e =>
                  setEditData({ ...editData, memo: e.target.value })
                }
                className="block w-full p-[9px] text-sm text-gray-900 rounded-lg bg-gray-50
                  border border-gray-200 hover:border-gray-300 transition-all duration-200
                  focus:border-blue-500 focus:bg-white outline-none
                  min-h-[100px] resize-y"
                placeholder="메모를 입력하세요"
              />
            ) : (
              <div
                className="block w-full p-[9px] text-sm text-gray-900 rounded-lg bg-gray-50
                border border-transparent transition-all duration-200 whitespace-pre-wrap min-h-[100px]"
              >
                {localContact.memo || "-"}
              </div>
            )}
          </div>
        </div>

        {/* 그룹 선택 */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            그룹
          </label>
          <div className="relative">
            {isEditing ? (
              <select
                value={localContact.groupId || ""}
                onChange={e => handleMoveToGroup(e.target.value || null)}
                className="block w-full p-[9px] text-sm text-gray-900 rounded-lg bg-gray-50
                  border border-gray-200 hover:border-gray-300 transition-all duration-200
                  focus:border-blue-500 focus:bg-white outline-none
                  appearance-none cursor-pointer"
              >
                <option value="">그룹 없음</option>
                {groups.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            ) : (
              <div
                className="block w-full p-[9px] text-sm text-gray-900 rounded-lg bg-gray-50
                border border-transparent transition-all duration-200"
              >
                {groups.find(g => g.id === localContact.groupId)?.name ||
                  "그룹 없음"}
              </div>
            )}
          </div>
        </div>

        {/* 저장 버튼 */}
        {isEditing && (
          <div className="flex justify-end pt-6">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 
                hover:bg-blue-700 rounded-lg transition-all duration-200"
            >
              저장
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactDetail;
