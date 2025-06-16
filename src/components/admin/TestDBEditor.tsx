// // 클라이언트 컴포넌트로 분리
// "use client";
// import { useState } from "react";
// import { MdSave, MdSync } from "react-icons/md";
// import { SauceTestV2 } from "@/types/saucetestV2Type";

// type CategoryKey = keyof SauceTestV2["categories"];

// interface TestDBEditorProps {
//   initialData: SauceTestV2;

// }

// function TestDBEditor({ initialData }: TestDBEditorProps) {
//   const [activeSort, setActiveSort] = useState<CategoryKey>(
//     Object.keys(initialData.categories)[0] as CategoryKey
//   );
//   const [editedData, setEditedData] = useState<SauceTestV2>(initialData);
//   const [isSaving, setIsSaving] = useState<boolean>(false);

//   const handleUpdate = async () => {
//     if (!window.confirm("변경사항을 저장하시겠습니까?")) {
//       return;
//     }

//     try {
//       setIsSaving(true);
//       const currentTime = new Date().toISOString();

//       const currentCategory = editedData.categories[activeSort];

//       const updatedData = {
//         ...editedData,
//         updatedAt: currentTime,
//         categories: {
//           ...editedData.categories,
//           [activeSort]: {
//             ...currentCategory,
//             updatedAt: currentTime,
//             questions: currentCategory.questions.map((q: Question) => ({
//               text: q.text,
//               score: q.score,
//               isDeleted: q.isDeleted || false,
//             })) as Question[],
//           },
//         },
//       };

//       await updateTestDB(updatedData);
//       setEditedData(updatedData);
//       alert("성공적으로 저장되었습니다.");
//     } catch (error) {
//       console.error("저장 중 오류 발생:", error);
//       alert("저장 중 오류가 발생했습니다. 다시 시도해주세요.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const sortKeys = Object.keys(editedData.categories) as CategoryKey[];

//   const handleQuestionChange = (
//     sortKey: CategoryKey,
//     questionIndex: number,
//     field: "text" | "score",
//     value: string | number
//   ) => {
//     const newData = { ...editedData };
//     const categoryData = newData.categories[sortKey];
//     categoryData.questions[questionIndex] = {
//       ...categoryData.questions[questionIndex],
//       [field]: value,
//     };
//     setEditedData(newData);
//   };

//   const handleStringArrayChange = (
//     sortKey: CategoryKey,
//     field: VerbField,
//     index: number,
//     value: string
//   ) => {
//     const newData = { ...editedData };
//     const categoryData = newData.categories[sortKey];
//     categoryData.verbs[field][index] = value;
//     setEditedData(newData);
//   };

//   const handleStartChange = (sortKey: CategoryKey, value: string) => {
//     const newData = { ...editedData };
//     const categoryData = newData.categories[sortKey];
//     categoryData.verbs.start = value;
//     setEditedData(newData);
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-lg p-4 max-w-7xl m-auto">
//       <div className="flex justify-between items-center mb-4 pb-1 border-b border-gray-200 gap-2">
//         <div className="flex flex-wrap gap-2">
//           {sortKeys.map(sortKey => (
//             <button
//               key={sortKey}
//               className={`px-4 py-2 rounded-t-lg transition-all duration-200 font-medium text-sm
//                 ${
//                   activeSort === sortKey
//                     ? "bg-blue-50 text-blue-600 border-b-2 border-blue-500"
//                     : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
//                 }`}
//               onClick={() => setActiveSort(sortKey)}
//             >
//               {sortKey}
//             </button>
//           ))}
//         </div>

//         <button
//           onClick={handleUpdate}
//           disabled={isSaving}
//           className="p-2 text-blue-500 rounded-lg hover:text-blue-600 transition-colors duration-200 text-sm font-medium"
//           title={isSaving ? "저장 중..." : "저장하기"}
//         >
//           {isSaving ? (
//             <MdSync className="animate-spin" size={20} />
//           ) : (
//             <MdSave size={20} />
//           )}
//         </button>
//       </div>

//       {activeSort && (
//         <div className="space-y-6">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <div className="bg-gray-50 rounded-xl p-4">
//               <div className="overflow-y-auto max-h-[600px] pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
//                 <div className="bg-white rounded-xl p-4 shadow-sm">
//                   <h3 className="text-md font-semibold text-gray-800 mb-3 capitalize">
//                     Start
//                   </h3>
//                   <input
//                     type="text"
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
//                     value={editedData.categories[activeSort].verbs.start}
//                     onChange={e =>
//                       handleStartChange(activeSort, e.target.value)
//                     }
//                   />
//                 </div>

//                 {["advance", "utility", "communicate", "expert"].map(
//                   arrayField => (
//                     <div
//                       key={arrayField}
//                       className="bg-white rounded-xl p-4 shadow-sm"
//                     >
//                       <h3 className="text-md font-semibold text-gray-800 mb-3 capitalize">
//                         {arrayField}
//                       </h3>
//                       <div className="grid grid-cols-2 gap-3">
//                         {editedData.categories[activeSort].verbs[
//                           arrayField as VerbField
//                         ].map((item: string, index: number) => (
//                           <input
//                             key={index}
//                             type="text"
//                             className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
//                             value={item}
//                             onChange={e =>
//                               handleStringArrayChange(
//                                 activeSort,
//                                 arrayField as VerbField,
//                                 index,
//                                 e.target.value
//                               )
//                             }
//                           />
//                         ))}
//                       </div>
//                     </div>
//                   )
//                 )}
//               </div>
//             </div>

//             <div className="bg-gray-50 rounded-xl p-4">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-md font-semibold text-gray-800">
//                   Questions
//                 </h3>
//                 <div className="flex items-center gap-4">
//                   <span className="text-sm text-gray-600">
//                     활성 문항:{" "}
//                     {
//                       editedData.categories[activeSort].questions.filter(
//                         (q: Question) => !q.isDeleted
//                       ).length
//                     }
//                     개
//                   </span>
//                 </div>
//               </div>
//               <div className="overflow-y-auto max-h-[600px] pr-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
//                 {editedData.categories[activeSort].questions.map(
//                   (question: Question, qIndex: number) => (
//                     <div
//                       key={qIndex}
//                       className={`p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${
//                         question.isDeleted ? "opacity-50 bg-gray-50" : ""
//                       }`}
//                     >
//                       <div className="flex gap-3">
//                         <div className="flex items-center">
//                           <input
//                             type="checkbox"
//                             className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                             checked={question.isDeleted || false}
//                             onChange={e => {
//                               const newData = { ...editedData };
//                               const categoryData =
//                                 newData.categories[activeSort];

//                               const currentActiveQuestions =
//                                 categoryData.questions.filter(
//                                   (q: Question) => !q.isDeleted
//                                 ).length;

//                               if (e.target.checked) {
//                                 if (currentActiveQuestions <= 10) {
//                                   alert(
//                                     "각 유형당 최소 10개의 문항이 필요합니다."
//                                   );
//                                   return;
//                                 }
//                               }

//                               categoryData.questions[qIndex] = {
//                                 ...categoryData.questions[qIndex],
//                                 isDeleted: e.target.checked,
//                               } as Question;
//                               setEditedData(newData);
//                             }}
//                           />
//                         </div>
//                         <div className="flex-grow space-y-2">
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                               Q{qIndex + 1}
//                             </label>
//                             <textarea
//                               className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
//                               value={question.text}
//                               onChange={e =>
//                                 handleQuestionChange(
//                                   activeSort,
//                                   qIndex,
//                                   "text",
//                                   e.target.value
//                                 )
//                               }
//                               rows={2}
//                             />
//                           </div>
//                         </div>
//                         <div className="w-20">
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Score
//                           </label>
//                           <input
//                             type="number"
//                             className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
//                             value={question.score}
//                             onChange={e =>
//                               handleQuestionChange(
//                                 activeSort,
//                                 qIndex,
//                                 "score",
//                                 parseInt(e.target.value)
//                               )
//                             }
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   )
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default TestDBEditor;
