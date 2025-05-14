import TeamDetail from "@/components/dashboard/contents/TeamDetail";
import { User } from "@/types/user";
const TeamPage = ({ params }: { params: { team: string } }) => {
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
              createdAt: "2025-03-23T06:01:48.523Z",
              categories: {
                uncertainty: [
                  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                ],
                grievance: [
                  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                ],
                autonomy: [
                  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                ],
                recognition: [
                  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                ],
                strain: [
                  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                ],
              },
              metadata: {
                totalScore: 100,
                averageScore: 1,
                categoryScores: {
                  grievance: {
                    average: 1,
                    total: 20,
                  },
                  autonomy: {
                    average: 1,
                    total: 20,
                  },
                  uncertainty: {
                    total: 20,
                    average: 1,
                  },
                  recognition: {
                    total: 20,
                    average: 1,
                  },
                  strain: {
                    average: 1,
                    total: 20,
                  },
                },
              },
            },
            sauceResult: {},
          },
        ],
      },
    ],
  };
  return <TeamDetail user={individualUser} teamId={params.team} />;
};

export default TeamPage;
