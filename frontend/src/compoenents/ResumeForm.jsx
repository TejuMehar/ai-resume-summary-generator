import { useState } from "react";

function ResumeForm() {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    skills: "",
    experience: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Generate Resume Summary
      </h2>

      <input
        name="name"
        placeholder="Your Name"
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        name="role"
        placeholder="Your Role (e.g. MERN Developer)"
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        name="skills"
        placeholder="Skills (React, Node, MongoDB...)"
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        name="experience"
        placeholder="Experience (e.g. 1 year)"
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
      />

      <button
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Generate Summary
      </button>
    </div>
  );
}

export default ResumeForm;
