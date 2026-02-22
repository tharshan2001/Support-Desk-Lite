import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../service/api";
import { ArrowLeft, Send, X } from "lucide-react";
import { toast } from "react-toastify";


const CreateTicketPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "low",
  });
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    console.log("[FORM CHANGE]", e.target.name, e.target.value);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      console.log("[ADD TAG]", tag);
      setTags([...tags, tag]);
    }
    setTagInput("");
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (t) => {
    console.log("[REMOVE TAG]", t);
    setTags(tags.filter((x) => x !== t));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { ...form, tags };
    console.log("[CREATE TICKET PAYLOAD]", payload);

    try {
      const res = await api.post("/tickets", payload);
      console.log("[CREATE TICKET SUCCESS]", res.data);

      toast.success("Ticket created successfully!");
      navigate("/");
    } catch (err) {
      console.error("[CREATE TICKET ERROR]", err.response || err);
      toast.error(err.response?.data?.message || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[500px] mx-auto py-10 px-4">

      <div className="bg-white shadow-md rounded-lg p-8 animate-fadeIn">
        <h2 className="text-2xl font-semibold mb-1">Raise a Ticket</h2>
        <p className="text-gray-500 mb-6">
          Describe your issue and we'll get it resolved
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Briefly describe the issue"
              value={form.title}
              onChange={handleChange}
              required
              minLength={5}
              maxLength={200}
              autoFocus
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Provide detailed information about the issue..."
              value={form.description}
              onChange={handleChange}
              rows={5}
              required
              minLength={10}
              maxLength={5000}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Priority */}
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium mb-1"
            >
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <div className="flex flex-wrap gap-2 border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
              {tags.map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => removeTag(t)}
                    className="flex items-center justify-center hover:text-green-900"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder={tags.length === 0 ? "Add tags (press Enter)" : ""}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={addTag}
                className="flex-1 min-w-[100px] focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-400/90 hover:bg-blue-400 text-white font-semibold py-2 rounded-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send size={16} /> Submit Ticket
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketPage;
