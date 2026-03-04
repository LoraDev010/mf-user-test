import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useUsersStore } from '../store/usersStore';
import styles from './UserFormModal.module.scss';
const empty = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'male',
};
function calcAge(dateStr) {
    const dob = new Date(dateStr);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate()))
        age--;
    return age;
}
export default function UserFormModal({ open, editUser, onClose }) {
    const addUser = useUsersStore((s) => s.addUser);
    const updateUser = useUsersStore((s) => s.updateUser);
    const [form, setForm] = useState(empty);
    const [errors, setErrors] = useState({});
    useEffect(() => {
        if (editUser) {
            setForm({
                firstName: editUser.name.first,
                lastName: editUser.name.last,
                email: editUser.email,
                phone: editUser.phone,
                dob: editUser.dob?.date ? editUser.dob.date.split('T')[0] : '',
                gender: editUser.gender || 'male',
            });
        }
        else {
            setForm(empty);
        }
        setErrors({});
    }, [editUser, open]);
    function validate() {
        const e = {};
        if (!form.firstName.trim())
            e.firstName = 'Requerido';
        if (!form.lastName.trim())
            e.lastName = 'Requerido';
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
            e.email = 'Email inválido';
        if (!form.phone.trim())
            e.phone = 'Requerido';
        if (!form.dob)
            e.dob = 'Requerido';
        setErrors(e);
        return Object.keys(e).length === 0;
    }
    function handleSubmit(ev) {
        ev.preventDefault();
        if (!validate())
            return;
        const fullName = `${form.firstName} ${form.lastName}`;
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=1400CC&color=fff&size=128`;
        const user = editUser
            ? {
                ...editUser,
                name: { ...editUser.name, first: form.firstName, last: form.lastName },
                email: form.email,
                phone: form.phone,
                gender: form.gender,
                dob: { date: form.dob, age: calcAge(form.dob) },
            }
            : {
                login: { uuid: crypto.randomUUID(), username: form.email },
                name: { title: form.gender === 'male' ? 'Mr' : 'Ms', first: form.firstName, last: form.lastName },
                email: form.email,
                phone: form.phone,
                gender: form.gender,
                dob: { date: form.dob, age: calcAge(form.dob) },
                location: { city: '', state: '', country: '' },
                picture: { large: avatarUrl, medium: avatarUrl, thumbnail: avatarUrl },
                nat: 'CO',
            };
        if (editUser) {
            updateUser(user);
        }
        else {
            addUser(user);
        }
        onClose();
    }
    function set(field) {
        return (e) => {
            setForm((prev) => ({ ...prev, [field]: e.target.value }));
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        };
    }
    return (_jsx(AnimatePresence, { children: open && (_jsxs("div", { className: styles.overlay, role: "dialog", "aria-modal": "true", "aria-label": editUser ? 'Editar usuario' : 'Nuevo usuario', children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: styles.backdrop, onClick: onClose }), _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95, y: 16 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: 16 }, transition: { duration: 0.22 }, className: styles.panel, children: [_jsxs("div", { className: styles.panelHeader, children: [_jsxs("div", { className: styles.panelHeaderLeft, children: [_jsx("div", { className: styles.panelIconWrap, children: _jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "#FFD400", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }), _jsx("circle", { cx: "12", cy: "7", r: "4" })] }) }), _jsx("h2", { className: styles.panelTitle, children: editUser ? 'Editar Usuario' : 'Nuevo Usuario' })] }), _jsx("button", { onClick: onClose, className: styles.closeBtn, children: "\u2715" })] }), _jsx("div", { className: styles.accentBar }), _jsxs("form", { onSubmit: handleSubmit, noValidate: true, className: styles.form, children: [_jsxs("div", { className: styles.twoCol, children: [_jsx(Field, { label: "Nombre", error: errors.firstName, children: _jsx("input", { className: errors.firstName ? styles.inputError : styles.input, placeholder: "Carlos", value: form.firstName, onChange: set('firstName') }) }), _jsx(Field, { label: "Apellido", error: errors.lastName, children: _jsx("input", { className: errors.lastName ? styles.inputError : styles.input, placeholder: "Garc\u00EDa", value: form.lastName, onChange: set('lastName') }) })] }), _jsx(Field, { label: "Correo electr\u00F3nico", error: errors.email, children: _jsx("input", { type: "email", className: errors.email ? styles.inputError : styles.input, placeholder: "carlos@example.com", value: form.email, onChange: set('email') }) }), _jsxs("div", { className: styles.twoCol, children: [_jsx(Field, { label: "Tel\u00E9fono", error: errors.phone, children: _jsx("input", { className: errors.phone ? styles.inputError : styles.input, placeholder: "+57 310 987 6543", value: form.phone, onChange: set('phone') }) }), _jsx(Field, { label: "Fecha de nacimiento", error: errors.dob, children: _jsx("input", { type: "date", className: errors.dob ? styles.inputError : styles.input, value: form.dob, onChange: set('dob') }) })] }), _jsx(Field, { label: "G\u00E9nero", children: _jsxs("select", { className: styles.input, value: form.gender, onChange: set('gender'), children: [_jsx("option", { value: "male", children: "Masculino" }), _jsx("option", { value: "female", children: "Femenino" })] }) }), _jsxs("div", { className: styles.actions, children: [_jsx("button", { type: "button", onClick: onClose, className: styles.btnCancel, children: "Cancelar" }), _jsx("button", { type: "submit", className: styles.btnSubmit, children: editUser ? 'Guardar cambios' : 'Crear usuario' })] })] })] })] })) }));
}
function Field({ label, error, children, }) {
    return (_jsxs("div", { className: styles.field, children: [_jsx("label", { className: styles.label, children: label }), children, error && _jsx("p", { className: styles.errorMsg, children: error })] }));
}
