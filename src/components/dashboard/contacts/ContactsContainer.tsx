"use client";

import { useState } from "react";
import { MdAdd } from "react-icons/md";
import ContactDetail from "./ContactDetail";
import ContactList from "./ContactList";
import ContactGroups from "./ContactGroups";
import {
  Contact,
  ContactGroup,
  CreateContactDto,
  UpdateContactDto,
} from "@/types/contacts";
import { useRouter } from "next/navigation";

interface ContactsContainerProps {
  initialGroups: ContactGroup[];
  initialContacts: Contact[];
  userId: string;
  // Server Actions as props
  createGroup: (
    userId: string,
    data: { name: string }
  ) => Promise<{ id: string }>;
  deleteGroup: (
    userId: string,
    groupId: string
  ) => Promise<{ success: boolean }>;
  updateGroup: (
    userId: string,
    data: { id: string; name: string }
  ) => Promise<{ success: boolean }>;
  createContact: (
    userId: string,
    data: CreateContactDto
  ) => Promise<{ id: string }>;
  deleteContact: (
    userId: string,
    contactId: string
  ) => Promise<{ success: boolean }>;
  updateContact: (
    userId: string,
    data: UpdateContactDto
  ) => Promise<{ success: boolean }>;
  moveContactToGroup: (
    userId: string,
    contactId: string,
    groupId: string | null
  ) => Promise<{ success: boolean }>;
}

const ContactsContainer = ({
  initialGroups,
  initialContacts,
  userId,
  createGroup,
  deleteGroup,
  updateGroup,
  createContact,
  deleteContact,
  updateContact,
  moveContactToGroup,
}: ContactsContainerProps) => {
  const router = useRouter();
  const [groups, setGroups] = useState<ContactGroup[]>(initialGroups);
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // 데이터를 새로 불러오는 함수
  const refreshData = () => {
    router.refresh(); // 현재 라우트의 서버 컴포넌트를 리프레시
  };

  // 그룹 관련 핸들러
  const handleCreateGroup = async (name: string) => {
    try {
      const { id } = await createGroup(userId, { name });
      const newGroup: ContactGroup = {
        id,
        name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setGroups(prev => [...prev, newGroup]);
    } catch (error) {
      console.error("Failed to create group:", error);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await deleteGroup(userId, groupId);
      setGroups(prev => prev.filter(group => group.id !== groupId));
      setContacts(prev =>
        prev.map(contact =>
          contact.groupId === groupId ? { ...contact, groupId: null } : contact
        )
      );
    } catch (error) {
      console.error("Failed to delete group:", error);
    }
  };

  // 그룹 수정 핸들러 추가
  const handleUpdateGroup = async (groupId: string, name: string) => {
    try {
      await updateGroup(userId, { id: groupId, name });
      setGroups(prev =>
        prev.map(group =>
          group.id === groupId
            ? { ...group, name, updatedAt: new Date().toISOString() }
            : group
        )
      );
      // 서버 데이터 리프레시
      refreshData();
    } catch (error) {
      console.error("Failed to update group:", error);
    }
  };

  // 연락처 관련 핸들러
  const handleCreateContact = async (contactData: {
    name: string;
    email?: string;
    phone?: string;
  }) => {
    try {
      const createData: CreateContactDto = {
        ...contactData,
        groupId: selectedGroupId,
      };
      const { id } = await createContact(userId, createData);
      const newContact: Contact = {
        id,
        ...contactData,
        groupId: selectedGroupId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setContacts(prev => [...prev, newContact]);
    } catch (error) {
      console.error("Failed to create contact:", error);
    }
  };

  const handleUpdateContact = async (
    contactId: string,
    updateData: Partial<Contact>
  ) => {
    try {
      const updateDto: UpdateContactDto = {
        id: contactId,
        ...updateData,
      };
      await updateContact(userId, updateDto);
      setContacts(prev =>
        prev.map(contact =>
          contact.id === contactId
            ? { ...contact, ...updateData, updatedAt: new Date().toISOString() }
            : contact
        )
      );
      // 서버 데이터 리프레시
      refreshData();
    } catch (error) {
      console.error("Failed to update contact:", error);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      await deleteContact(userId, contactId);
      setContacts(prev => prev.filter(contact => contact.id !== contactId));
      if (selectedContact?.id === contactId) {
        setSelectedContact(null);
      }
      // 서버 데이터 리프레시
      refreshData();
    } catch (error) {
      console.error("Failed to delete contact:", error);
    }
  };

  const handleMoveToGroup = async (
    contactId: string,
    groupId: string | null
  ) => {
    try {
      await moveContactToGroup(userId, contactId, groupId);
      setContacts(prev =>
        prev.map(contact =>
          contact.id === contactId
            ? { ...contact, groupId, updatedAt: new Date().toISOString() }
            : contact
        )
      );
    } catch (error) {
      console.error("Failed to move contact to group:", error);
    }
  };

  // 필터링된 연락처 목록
  const filteredContacts = selectedGroupId
    ? contacts.filter(contact => contact.groupId === selectedGroupId)
    : contacts;

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F7F9] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 h-screen gap-4">
      <div className="flex-1 bg-white rounded-2xl shadow-xl border border-gray-100 min-h-0">
        <div className="flex h-full">
          {/* 그룹 목록 */}
          <div className="w-64 border-r p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700">그룹</h2>
              <button
                onClick={() => handleCreateGroup("새 그룹")}
                className="p-1.5 hover:bg-orange-50 rounded-full text-gray-600 transition-colors"
              >
                <MdAdd size={20} />
              </button>
            </div>
            <ContactGroups
              groups={groups}
              selectedGroupId={selectedGroupId}
              onSelectGroup={setSelectedGroupId}
              onDeleteGroup={handleDeleteGroup}
              onUpdateGroup={handleUpdateGroup}
            />
          </div>

          {/* 연락처 목록 */}
          <div className="w-96 border-r p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-700">리스트</h2>
                <span className="px-2 py-0.5 bg-gray-50 text-gray-600 text-sm font-medium rounded-full border border-gray-100">
                  {filteredContacts.length}
                </span>
              </div>
              <button
                onClick={() => handleCreateContact({ name: "새 연락처" })}
                className="p-1.5 hover:bg-orange-50 rounded-full text-gray-600 transition-colors"
              >
                <MdAdd size={20} />
              </button>
            </div>
            <ContactList
              contacts={filteredContacts}
              selectedContact={selectedContact}
              onSelectContact={setSelectedContact}
              onDeleteContact={handleDeleteContact}
            />
          </div>

          {/* 연락처 상세 */}
          <div className="flex-1 p-6">
            <ContactDetail
              contact={selectedContact}
              groups={groups}
              onUpdateContact={handleUpdateContact}
              onMoveToGroup={handleMoveToGroup}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsContainer;
