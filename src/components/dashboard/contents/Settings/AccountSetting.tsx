"use client";

import { UserBase } from "@/types/user";
import React, { useState } from "react";
import { MdLock, MdPerson, MdWarning } from "react-icons/md";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                  {title}
                </h3>
                <div className="mt-4">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AccountSettingProps {
  userBase: UserBase;

  optoutUser: (
    userId: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean }>;
}

const AccountSetting = ({ userBase, optoutUser }: AccountSettingProps) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // 비밀번호 변경 로직 구현
    setIsPasswordModalOpen(false);
  };

  const handleAccountDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const optoutResult = await optoutUser(
        userBase.id,
        userBase.email,
        currentPassword
      );

      // 유저 삭제 후 로그아웃
      await signOut();
      router.push("/");

      if (!optoutResult.success) {
        throw new Error("계정 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-8">계정 설정</h1>

      <div className="space-y-6">
        {/* 프로필 정보 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <MdPerson className="text-gray-600" size={24} />
            <h2 className="text-lg font-semibold">프로필 정보</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                이름
              </label>
              <div className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100">
                {userBase.name}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                이메일
              </label>
              <div className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100">
                {userBase.email}
              </div>
            </div>
          </div>
        </div>

        {/* 계정 보안 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <MdLock className="text-gray-600" size={24} />
            <h2 className="text-lg font-semibold">계정 보안</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-medium mb-2">비밀번호 변경</h3>
              <p className="text-gray-600 mb-4">
                주기적인 비밀번호 변경을 통해 계정을 안전하게 보호하세요.
              </p>
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="w-32 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 text-center"
              >
                비밀번호 변경
              </button>
            </div>
            <div className="pt-4 border-t">
              <h3 className="text-base font-medium text-red-600 mb-2">
                계정 삭제
              </h3>
              <p className="text-gray-600 mb-4">
                계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이 작업은
                되돌릴 수 없습니다.
              </p>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="w-32 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-center"
              >
                계정 삭제
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 비밀번호 변경 모달 */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="비밀번호 변경"
      >
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              현재 비밀번호
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              새 비밀번호
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              새 비밀번호 확인
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(false)}
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200"
            >
              취소
            </button>
            <button
              type="submit"
              className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
            >
              변경하기
            </button>
          </div>
        </form>
      </Modal>

      {/* 계정 삭제 모달 */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title=""
      >
        <form onSubmit={handleAccountDelete} className="space-y-6">
          {/* 상단 경고 아이콘 및 헤드라인 */}
          <div className="flex flex-col items-center justify-center p-4 bg-red-100 rounded-lg">
            <MdWarning className="text-red-600 mb-2" size={40} />
            <h2 className="text-xl font-bold text-red-700 mb-1">
              정말 계정을 삭제하시겠습니까?
            </h2>
            <p className="text-red-600 text-center text-sm">
              계정 삭제 시 모든 데이터가{" "}
              <span className="font-semibold">영구적으로 삭제</span>되며,
              <br />
              <span className="font-semibold">
                이 작업은 되돌릴 수 없습니다.
              </span>
            </p>
          </div>
          {/* 비밀번호 입력 안내문 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              본인 확인을 위해{" "}
              <span className="font-bold text-red-600">비밀번호</span>를 입력해
              주세요.
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-red-500 focus:border-red-500"
              placeholder="비밀번호 입력"
              required
            />
          </div>
          {/* 버튼 영역 */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 transition"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={currentPassword.length === 0}
              className={`px-4 py-2 rounded-md font-semibold transition ${
                currentPassword.length > 0
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              영구 삭제
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AccountSetting;
