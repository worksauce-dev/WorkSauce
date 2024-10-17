"use client";

import { useState } from "react";
import { sendEmail } from "@/utils/sendEmail";

export default function EmailForm() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const success = await sendEmail({
      to: email,
      subject: subject,
      text: message,
    });

    if (success) {
      alert("이메일 전송 성공!");
      setEmail("");
      setSubject("");
      setMessage("");
    } else {
      alert("이메일 전송 실패. 다시 시도해주세요.");
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
