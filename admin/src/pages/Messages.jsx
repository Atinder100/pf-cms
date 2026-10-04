import { useEffect, useState } from "react";
import axios from "axios";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.get(
        "http://localhost:5000/api/messages",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(response.data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      await axios.delete(
        `http://localhost:5000/api/messages/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete message:", error);
      alert("Failed to delete message");
    }
  };

  if (loading) {
    return <p>Loading messages...</p>;
  }

  return (
    <div>
      <h1>Messages</h1>

      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <div>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                border: "1px solid #ddd",
                padding: "20px",
                marginBottom: "15px",
                borderRadius: "8px",
              }}
            >
              <h3>{message.name}</h3>

              <p>
                <strong>Email:</strong> {message.email}
              </p>

              <p>
                <strong>Message:</strong>
              </p>

              <p>{message.message}</p>

              <p>
                <strong>Submitted:</strong>{" "}
                {new Date(message.created_at).toLocaleString()}
              </p>

              <button onClick={() => handleDelete(message.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Messages;