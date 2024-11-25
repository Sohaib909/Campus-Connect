import React, { useState } from "react";

const ManageStudents = () => {
  const [students, setStudents] = useState([
    { id: 1, name: "Student 1", applied: true },
    { id: 2, name: "Student 2", applied: false },
    { id: 3, name: "Student 3", applied: true },
  ]);

  const addStudent = () => {
    const newStudent = {
      id: students.length + 1,
      name: `Student ${students.length + 1}`,
      applied: false,
    };
    setStudents([...students, newStudent]);
  };

  const deleteStudent = (id) => {
    const updatedStudents = students.filter((student) => student.id !== id);
    setStudents(updatedStudents);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <h1 className="text-2xl font-semibold mb-4">Manage Students</h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={addStudent}
          className="bg-green-500 hover:bg-green-700 text-white px-2 py-1 rounded mr-2"
        >
          Add Student
        </button>
        <button
          onClick={() => deleteStudent(students[students.length - 1].id)}
          className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded"
        >
          Delete Student
        </button>
      </div>

      <ul>
        {students.map((student) => (
          <li
            key={student.id}
            className="bg-white p-4 rounded shadow-md flex justify-between items-center mb-2"
          >
            <span>{student.name}</span>
            {student.applied ? (
              <span className="text-green-500">Applied</span>
            ) : (
              <span className="text-red-500">Not Applied</span>
            )}
            <button
              onClick={() => deleteStudent(student.id)}
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

export default ManageStudents;
