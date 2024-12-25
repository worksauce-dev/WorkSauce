// 연락처 기본 인터페이스
export interface Contact {
  id: string;
  name: string;
  email?: string;
  memo?: string;
  phone?: string;
  groupId?: string | null;
  createdAt: string;
  updatedAt: string;
}

// 그룹 기본 인터페이스
export interface ContactGroup {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// API 응답 타입
export interface ContactsResponse {
  contacts: Contact[];
  total: number;
}

export interface ContactGroupsResponse {
  groups: ContactGroup[];
  total: number;
}

// API 요청 타입
export interface CreateContactDto {
  name: string;
  email?: string;
  memo?: string;
  phone?: string;
  groupId?: string | null;
}

export interface UpdateContactDto extends Partial<CreateContactDto> {
  id: string;
}

export interface CreateGroupDto {
  name: string;
}

export interface UpdateGroupDto extends Partial<CreateGroupDto> {
  id: string;
}
