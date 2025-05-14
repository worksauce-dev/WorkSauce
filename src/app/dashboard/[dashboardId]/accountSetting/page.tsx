import AccountSetting from "@/components/dashboard/contents/AccountSetting";
import { User } from "@/types/user";

const AccountSettingPage = () => {
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
    ],
  };

  return <AccountSetting user={individualUser} />;
};

export default AccountSettingPage;
