export type AppError = {
  title: string;
  message: string;
  showHomeButton?: boolean;
};

export const ERROR_MESSAGES = {
  AUTH: {
    LOGIN_REQUIRED: {
      title: "로그인이 필요합니다",
      message: "이 페이지에 접근하려면 먼저 로그인해 주세요.",
      showHomeButton: true,
    },
    ACCESS_DENIED: {
      title: "접근 권한이 없습니다",
      message: "이 페이지에 대한 접근 권한이 없습니다.",
      showHomeButton: true,
    },
    USER_NOT_FOUND: {
      title: "사용자 정보를 찾을 수 없습니다",
      message: "사용자 정보를 불러오는데 실패했습니다. 다시 로그인해 주세요.",
      showHomeButton: true,
    },
  },
  GROUP: {
    NOT_FOUND: {
      title: "그룹을 찾을 수 없습니다",
      message: "요청하신 그룹이 존재하지 않거나 삭제되었습니다.",
      showHomeButton: true,
    },
    ACCESS_DENIED: {
      title: "접근 권한이 없습니다",
      message: "이 그룹에 대한 접근 권한이 없습니다.",
      showHomeButton: true,
    },
  },
  TEST: {
    NOT_FOUND: {
      title: "테스트를 찾을 수 없습니다",
      message:
        "요청하신 테스트가 삭제되었거나 존재하지 않습니다. 관리자에게 문의해 주세요.",
      showHomeButton: true,
    },
    EXPIRED: {
      title: "만료된 테스트입니다",
      message: "테스트 기간이 만료되었습니다.",
      showHomeButton: true,
    },
  },
  APPLICANT: {
    NOT_FOUND: {
      title: "지원자를 찾을 수 없습니다",
      message: "해당 이름의 지원자가 존재하지 않습니다.",
      showHomeButton: true,
    },
  },
} as const;
