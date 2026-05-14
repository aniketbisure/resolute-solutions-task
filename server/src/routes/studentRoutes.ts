import { Router } from 'express';
import { register, getAllStudents, updateStudent, deleteStudent, login } from '../controllers/studentController';

const router = Router();

router.post('/register', register);
router.get('/students', getAllStudents);
router.put('/student/:id', updateStudent);
router.delete('/student/:id', deleteStudent);
router.post('/login', login);

export default router;
