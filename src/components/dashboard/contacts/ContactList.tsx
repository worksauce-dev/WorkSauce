"use client";

import { Contact } from "@/types/contacts";
import { MdDelete } from "react-icons/md";

interface ContactListProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  onSelectContact: (contact: Contact) => void;
  onDeleteContact: (contactId: string) => void;
}

const ContactList = ({
  contacts,
  selectedContact,
  onSelectContact,
  onDeleteContact,
}: ContactListProps) => {
  return (
    <div className="flex-1 overflow-y-auto px-1 pt-1 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
      <div className="space-y-2">
        {contacts.map(contact => (
          <div
            key={contact.id}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
              selectedContact?.id === contact.id
                ? "bg-orange-50 shadow-sm ring-1 ring-orange-100"
                : "hover:bg-gray-50"
            }`}
            onClick={() => onSelectContact(contact)}
          >
            <div className="flex-1 min-w-0 mr-2">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {contact.name}
              </h3>
              {contact.email && (
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {contact.email}
                </p>
              )}
            </div>
            <button
              onClick={e => {
                e.stopPropagation();
                onDeleteContact(contact.id);
              }}
              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors group shrink-0"
            >
              <MdDelete
                size={16}
                className="text-gray-400 group-hover:text-red-500 transition-colors"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactList;
