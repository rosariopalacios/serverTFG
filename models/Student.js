import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ObjectId = Schema.ObjectId;
const studentSchema = new Schema({
    id: ObjectId,
    numero: String,
    dni: String,
    nombre: String,
    email: String,
    convocatorias: String,
    matriculas: String,
    evalucionDiferenciada: String,
    erasmus: String,
    clasesExpositivas: String,
    practicasDeAula: String,
    practicasDeLaboratorio: String,
    tutoriasGrupales: String,
    password: String,
    isAdmin: Boolean,
    arrayClick: Array,
    form: Object
});

// Convertir a modelo
const Student = mongoose.model('Student', studentSchema);

export default Student;