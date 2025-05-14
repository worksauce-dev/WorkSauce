import MemberDetail from "@/components/dashboard/contents/MemberDetail";

const MemberPage = () => {
  const userTeam = [
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
  ];

  return <MemberDetail userTeam={userTeam} />;
};

export default MemberPage;
