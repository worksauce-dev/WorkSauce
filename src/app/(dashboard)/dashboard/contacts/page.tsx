import { getContacts } from "@/api/firebase/contacts/getContacts";
import { getContactGroups } from "@/api/firebase/contacts/getContactGroups";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import {
  createGroup,
  deleteGroup,
  updateGroup,
} from "@/api/firebase/contacts/groupActions";
import {
  createContact,
  deleteContact,
  updateContact,
  moveContactToGroup,
} from "@/api/firebase/contacts/contactActions";
import ContactsContainer from "@/components/dashboard/contacts/ContactsContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "연락처 관리",
};

export default async function ContactsPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  const [groupsData, contactsData] = await Promise.all([
    getContactGroups(userId),
    getContacts(userId),
  ]);

  return (
    <ContactsContainer
      initialGroups={groupsData.groups}
      initialContacts={contactsData.contacts}
      userId={userId}
      createGroup={createGroup}
      deleteGroup={deleteGroup}
      updateGroup={updateGroup}
      createContact={createContact}
      deleteContact={deleteContact}
      updateContact={updateContact}
      moveContactToGroup={moveContactToGroup}
    />
  );
}
