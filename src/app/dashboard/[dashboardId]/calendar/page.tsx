import Calendar from "@/components/dashboard/contents/Calendar";
import { Group } from "@/types/group";
import { User } from "@/types/user";
const CalendarPage = () => {
  const mockGroups: Group[] = [
    {
      groupId: "group-001",
      name: "프론트엔드 개발자 채용",
      deadline: "2025-04-30T23:59:59",
      keywords: ["React", "TypeScript", "Next.js"],
      applicants: [
        {
          name: "김철수",
          email: "chulsoo@example.com",
          groupId: "group-001",
          testStatus: "pending",
          completedAt: null,
          testResult: [],
          groupName: "프론트엔드 개발자 채용",
        },
        {
          name: "이영희",
          email: "younghee@example.com",
          groupId: "group-001",
          testStatus: "completed",
          completedAt: "2025-04-09T10:15:00",
          testResult: [],
          groupName: "프론트엔드 개발자 채용",
        },
      ],
      createdAt: "2025-04-01T09:00:00",
      updatedAt: "2025-04-10T15:30:00",
      createdBy: { id: "user-001", name: "홍길동" },
      updatedBy: { id: "user-001", name: "홍길동" },
      testType: "sugar",
    },
    {
      groupId: "group-002",
      name: "백엔드 개발자 채용",
      deadline: "2025-04-30T23:59:59",
      keywords: ["Node.js", "Python", "Django"],
      applicants: [
        {
          name: "박민수",
          email: "minsu@example.com",
          groupId: "group-002",
          testStatus: "expired",
          completedAt: null,
          testResult: [],
          groupName: "백엔드 개발자 채용",
        },
        {
          name: "정지은",
          email: "jieun@example.com",
          groupId: "group-002",
          testStatus: "pending",
          completedAt: null,
          testResult: [],
          groupName: "백엔드 개발자 채용",
        },
      ],
      createdAt: "2025-04-01T09:00:00",
      updatedAt: "2025-04-11T12:00:00",
      createdBy: { id: "user-002", name: "김사장" },
      updatedBy: { id: "user-002", name: "김사장" },
      testType: "sauce",
    },
    {
      groupId: "group-003",
      name: "UX/UI 디자이너 채용",
      deadline: "2025-04-30T23:59:59",
      keywords: ["Figma", "Adobe XD", "UI/UX"],
      applicants: [
        {
          name: "최예진",
          email: "yejin@example.com",
          groupId: "group-003",
          testStatus: "completed",
          completedAt: "2025-04-07T09:30:00",
          testResult: [],
          groupName: "UX/UI 디자이너 채용",
        },
      ],
      createdAt: "2025-04-01T09:00:00",
      updatedAt: "2025-04-07T10:00:00",
      createdBy: { id: "user-003", name: "이팀장" },
      updatedBy: { id: "user-003", name: "이팀장" },
      testType: "sugar",
    },
  ];

  const individualUser: User = {
    userBase: {
      id: "1",
      name: "홍길동",
      email: "hong@example.com",
      userType: "individual",
      status: "active",
      isAdmin: false,
      plan: "free",
      provider: "google",
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
      lastLoginAt: "2023-01-01T00:00:00Z",
      isFirstLogin: false,
      agreeTerms: true,
      metaData: {
        sugar: {
          personalAverage: 75,
          testsCompleted: 10,
          lastTestDate: "2023-01-01",
          teamsParticipated: ["team1", "team2"],
        },
      },
      dashboardId: "vFZ2fISvXf89QTzlvbMG",
      notifications: [
        {
          name: "홍길동",
          email: "example@example.com",
          userId: "user123",
          type: "invite",
          status: "pending",
          createdAt: "2023-01-01T00:00:00Z",
          completedAt: "",
        },
        {
          name: "홍길동",
          email: "example@example.com",
          userId: "user123",
          type: "invite",
          status: "pending",
          createdAt: "2023-01-01T00:00:00Z",
          completedAt: "",
        },
        {
          name: "홍길동",
          type: "testCompleted",
          testType: "sugar",
          status: "pending",
          createdAt: "2023-01-02T00:00:00Z",
          completedAt: "",
        },
        {
          name: "홍길동",
          type: "testCompleted",
          testType: "sauce",
          status: "completed",
          createdAt: "2023-01-03T00:00:00Z",
          completedAt: "2023-01-03T01:30:00Z",
        },
      ],
    },
    userTeam: [
      {
        id: "asdasd",
        name: "개인zxczxc",
        description: "홍길동의 개인 팀",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
        members: [
          {
            id: "1",
            name: "홍길동",
            email: "hong@example.com",
            sugarResult: {
              createdAt: "2023-01-01T00:00:00Z",
              groupId: "group1",
              categories: {
                리더십: [85, 90, 75],
                의사소통: [80, 85, 90],
                문제해결: [75, 80, 85],
                팀워크: [90, 85, 80],
              },
              metadata: {
                totalScore: 85,
                categoryScores: {
                  리더십: {
                    total: 250,
                    average: 83.33,
                  },
                  의사소통: {
                    total: 255,
                    average: 85,
                  },
                  문제해결: {
                    total: 240,
                    average: 80,
                  },
                  팀워크: {
                    total: 255,
                    average: 85,
                  },
                },
                averageScore: 83.33,
              },
            },
            sauceResult: {},
          },
        ],
      },
      {
        id: "team2",
        name: "팀 2",
        description: "팀 2 설명",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
        members: [
          {
            id: "1",
            name: "홍길동",
            email: "hong@example.com",
            sugarResult: {
              createdAt: "2023-01-01T00:00:00Z",
              groupId: "group1",
              categories: {
                리더십: [85, 90, 75],
                의사소통: [80, 85, 90],
                문제해결: [75, 80, 85],
                팀워크: [90, 85, 80],
              },
              metadata: {
                totalScore: 85,
                categoryScores: {
                  리더십: {
                    total: 250,
                    average: 83.33,
                  },
                  의사소통: {
                    total: 255,
                    average: 85,
                  },
                  문제해결: {
                    total: 240,
                    average: 80,
                  },
                  팀워크: {
                    total: 255,
                    average: 85,
                  },
                },
                averageScore: 83.33,
              },
            },
            sauceResult: {},
          },
        ],
      },
      {
        id: "team1",
        name: "개인 팀",
        description: "홍길동의 개인 팀",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
        members: [
          {
            id: "1",
            name: "홍길동",
            email: "hong@example.com",
            sugarResult: {
              createdAt: "2023-01-01T00:00:00Z",
              groupId: "group1",
              categories: {
                리더십: [85, 90, 75],
                의사소통: [80, 85, 90],
                문제해결: [75, 80, 85],
                팀워크: [90, 85, 80],
              },
              metadata: {
                totalScore: 85,
                categoryScores: {
                  리더십: {
                    total: 250,
                    average: 83.33,
                  },
                  의사소통: {
                    total: 255,
                    average: 85,
                  },
                  문제해결: {
                    total: 240,
                    average: 80,
                  },
                  팀워크: {
                    total: 255,
                    average: 85,
                  },
                },
                averageScore: 83.33,
              },
            },
            sauceResult: {},
          },
        ],
      },
      {
        id: "team4",
        name: "개인 팀ㅋㅌㅊㅋㅌㅊㅋㅌㅊ",
        description: "홍길동의 개인 팀",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
        members: [
          {
            id: "1",
            name: "홍길동",
            email: "hong@example.com",
            sugarResult: {
              createdAt: "2023-01-01T00:00:00Z",
              groupId: "group1",
              categories: {
                리더십: [85, 90, 75],
                의사소통: [80, 85, 90],
                문제해결: [75, 80, 85],
                팀워크: [90, 85, 80],
              },
              metadata: {
                totalScore: 85,
                categoryScores: {
                  리더십: {
                    total: 250,
                    average: 83.33,
                  },
                  의사소통: {
                    total: 255,
                    average: 85,
                  },
                  문제해결: {
                    total: 240,
                    average: 80,
                  },
                  팀워크: {
                    total: 255,
                    average: 85,
                  },
                },
                averageScore: 83.33,
              },
            },
            sauceResult: {},
          },
        ],
      },
      {
        id: "team5",
        name: "개인 팀ㅋㅌㅊㅋㅋㅌㅊㅋㅌㅊㅌㅊㅋㅌㅊ",
        description: "홍길동의 개인 팀",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
        members: [
          {
            id: "1",
            name: "홍길동",
            email: "hong@example.com",
            sugarResult: {
              createdAt: "2023-01-01T00:00:00Z",
              groupId: "group1",
              categories: {
                리더십: [85, 90, 75],
                의사소통: [80, 85, 90],
                문제해결: [75, 80, 85],
                팀워크: [90, 85, 80],
              },
              metadata: {
                totalScore: 85,
                categoryScores: {
                  리더십: {
                    total: 250,
                    average: 83.33,
                  },
                  의사소통: {
                    total: 255,
                    average: 85,
                  },
                  문제해결: {
                    total: 240,
                    average: 80,
                  },
                  팀워크: {
                    total: 255,
                    average: 85,
                  },
                },
                averageScore: 83.33,
              },
            },
            sauceResult: {},
          },
        ],
      },
    ],
  };
  return <Calendar user={individualUser} groups={mockGroups} />;
};

export default CalendarPage;
