import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const FeedbackForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const navigateTo = useNavigate();

  const handleFeedback = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/feedback/submit",
        { name, email, message },
        {
            withCredentials:true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setName("");
      setEmail("");
      setMessage("");
      toast.success(data.message);
      navigateTo("/"); // Redirect after successful submission (optional)
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <section className="application">
      <div className="container">
        <h3>Submit Your Feedback</h3>
        <form onSubmit={handleFeedback}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <textarea
            placeholder="Write your feedback..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button type="submit">Submit Feedback</button>
        </form>
      </div>
    </section>
  );
};

export default FeedbackForm;
