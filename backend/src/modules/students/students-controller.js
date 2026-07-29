const asyncHandler = require("express-async-handler");
const { ApiError } = require("../../utils");
const { getAllStudents, addNewStudent, getStudentDetail, setStudentStatus, updateStudent } = require("./students-service");

const parseStudentId = (id) => {
    const studentId = Number(id);
    if (!Number.isInteger(studentId) || studentId <= 0) {
        throw new ApiError(400, "Invalid student id");
    }

    return studentId;
}

const handleGetAllStudents = asyncHandler(async (req, res) => {
    const { name, class: className, section, roll } = req.query;
    const students = await getAllStudents({ name, className, section, roll });
    res.json({ students });
});

const handleAddStudent = asyncHandler(async (req, res) => {
    const payload = req.body;
    const message = await addNewStudent(payload);
    res.status(201).json(message);
});

const handleUpdateStudent = asyncHandler(async (req, res) => {
    const userId = parseStudentId(req.params.id);
    const payload = req.body;
    const message = await updateStudent({ ...payload, userId });
    res.json(message);
});

const handleGetStudentDetail = asyncHandler(async (req, res) => {
    const id = parseStudentId(req.params.id);
    const student = await getStudentDetail(id);
    res.json(student);
});

const handleStudentStatus = asyncHandler(async (req, res) => {
    const userId = parseStudentId(req.params.id);
    const { id: reviewerId } = req.user;
    const { status } = req.body;
    if (typeof status !== "boolean") {
        throw new ApiError(400, "Status must be a boolean value");
    }

    const message = await setStudentStatus({ userId, reviewerId, status });
    res.json(message);
});

module.exports = {
    handleGetAllStudents,
    handleGetStudentDetail,
    handleAddStudent,
    handleStudentStatus,
    handleUpdateStudent,
};
