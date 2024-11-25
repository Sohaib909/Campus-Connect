import React, { useState } from "react";

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([
    { id: 1, name: "Teacher 1" },
    { id: 2, name: "Teacher 2" },
    { id: 3, name: "Teacher 3" },
  ]);

  const addTeacher = () => {
    const newTeacher = {
      id: teachers.length + 1,
      name: `Teacher ${teachers.length + 1}`,
    };
    setTeachers([...teachers, newTeacher]);
  };

  const deleteTeacher = (id) => {
    const updatedTeachers = teachers.filter((teacher) => teacher.id !== id);
    setTeachers(updatedTeachers);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <h1 className="text-2xl font-semibold mb-4">Manage Teachers</h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={addTeacher}
          className="bg-green-500 hover:bg-green-700 text-white px-2 py-1 rounded mr-2"
        >
          Add Teacher
        </button>
        <button
          onClick={() => deleteTeacher(teachers[teachers.length - 1].id)}
          className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded"
        >
          Delete Teacher
        </button>
      </div>

      <ul>
        {teachers.map((teacher) => (
          <li
            key={teacher.id}
            className="bg-white p-4 rounded shadow-md flex justify-between items-center mb-2"
          >
            <span>{teacher.name}</span>
            <button
              onClick={() => deleteTeacher(teacher.id)}
              className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageTeachers;
