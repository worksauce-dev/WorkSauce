"use client";

import { ContactGroup } from "@/types/contacts";
import { MdDelete, MdEdit } from "react-icons/md";
import { useState } from "react";

interface ContactGroupsProps {
  groups: ContactGroup[];
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string | null) => void;
  onDeleteGroup: (groupId: string) => void;
  onUpdateGroup: (groupId: string, name: string) => void;
}

const ContactGroups = ({
  groups,
  selectedGroupId,
  onSelectGroup,
  onDeleteGroup,
  onUpdateGroup,
}: ContactGroupsProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleStartEdit = (group: ContactGroup) => {
    setEditingId(group.id);
    setEditName(group.name);
  };

  const handleSave = (groupId: string) => {
    if (editName.trim()) {
      onUpdateGroup(groupId, editName.trim());
      setEditingId(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-1 pt-1">
      <div className="space-y-2">
        <div
          className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
            selectedGroupId === null
              ? "bg-orange-50 shadow-sm ring-1 ring-orange-100"
              : "hover:bg-gray-50"
          }`}
          onClick={() => onSelectGroup(null)}
        >
          <span className="text-sm font-medium text-gray-700">전체 연락처</span>
        </div>

        {groups.map(group => (
          <div
            key={group.id}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
              selectedGroupId === group.id
                ? "bg-orange-50 shadow-sm ring-1 ring-orange-100"
                : "hover:bg-gray-50"
            }`}
          >
            {editingId === group.id ? (
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onBlur={() => handleSave(group.id)}
                onKeyPress={e => e.key === "Enter" && handleSave(group.id)}
                className="flex-1 p-2 text-sm text-gray-900 rounded-lg bg-white
                  border border-gray-200 hover:border-orange-200 transition-all duration-200
                  focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                autoFocus
              />
            ) : (
              <>
                <span
                  className="text-sm font-medium text-gray-700 flex-1 p-[9px]"
                  onClick={() => onSelectGroup(group.id)}
                >
                  {group.name}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleStartEdit(group);
                    }}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MdEdit size={16} className="text-gray-500" />
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onDeleteGroup(group.id);
                    }}
                    className="p-1.5 hover:bg-red-50 rounded-lg transition-colors group"
                  >
                    <MdDelete
                      size={16}
                      className="text-gray-500 group-hover:text-red-500"
                    />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactGroups;
