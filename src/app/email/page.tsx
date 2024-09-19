"use client";

// 지원자에게 이메일 보내기
// 지원자들의 이메일을 입력하는 인풋. 내용은 필요없음 보내기 버튼만 보내면 된다.
//

import { useState } from "react";

export default function EmailForm() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: email,
        subject: subject,
        text: message,
      }),
    });

    if (res.ok) {
      alert("Email sent successfully!");
      setEmail("");
      setSubject("");
      setMessage("");
    } else {
      alert("Failed to send email. Please try again.");
    }
  };

  return (
    <div className="w-full h-screen">
      <form onSubmit={e => handleSubmit(e)} className="p-40 mx-60 mt-16">
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">
            Recipient Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="subject" className="block mb-2">
            Subject:
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block mb-2">
            Message:
          </label>
          <textarea
            id="message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
            rows={4}
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Send Email
        </button>
      </form>
    </div>
  );
}
