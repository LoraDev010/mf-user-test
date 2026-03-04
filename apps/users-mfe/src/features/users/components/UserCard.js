import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'motion/react';
import { useUsersStore } from '../store/usersStore';
import styles from './UserCard.module.scss';
export default function UserCard({ user, index, onSelect, onEdit, isLocal }) {
    const deleteUser = useUsersStore((s) => s.deleteUser);
    const fullName = `${user.name.first} ${user.name.last}`;
    const avatarSrc = user.picture.medium ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=1400CC&color=fff&size=128`;
    const dob = user.dob?.date
        ? new Date(user.dob.date).toLocaleDateString('es-CO', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
        })
        : '—';
    function handleDelete(e) {
        e.stopPropagation();
        if (confirm(`¿Eliminar a ${fullName}?`)) {
            deleteUser(user.login.uuid);
        }
    }
    function handleEdit(e) {
        e.stopPropagation();
        onEdit?.(user);
    }
    function handleView(e) {
        e.stopPropagation();
        onSelect?.(user);
    }
    return (_jsxs(motion.article, { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.035, duration: 0.3, ease: 'easeOut' }, whileHover: { y: -3 }, className: styles.card, children: [_jsx("div", { className: isLocal ? styles.barAccent : styles.barBrand }), _jsxs("div", { className: styles.body, children: [_jsxs("div", { className: styles.avatarWrap, children: [_jsx("div", { className: styles.avatarRing, children: _jsx("img", { src: avatarSrc, alt: fullName, className: styles.avatar, loading: "lazy" }) }), isLocal && (_jsx("span", { className: styles.localBadge, title: "Usuario local" }))] }), _jsx("h3", { className: styles.name, children: fullName }), _jsxs("ul", { className: styles.infoList, children: [_jsx(InfoRow, { icon: _jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: styles.infoIcon, children: [_jsx("rect", { x: "2", y: "4", width: "20", height: "16", rx: "2" }), _jsx("path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" })] }), value: user.email }), _jsx(InfoRow, { icon: _jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: styles.infoIcon, children: _jsx("path", { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72c.127.96.36 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.09a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0 1 21.73 17.5z" }) }), value: user.phone }), _jsx(InfoRow, { icon: _jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: styles.infoIcon, children: [_jsx("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2" }), _jsx("line", { x1: "16", y1: "2", x2: "16", y2: "6" }), _jsx("line", { x1: "8", y1: "2", x2: "8", y2: "6" }), _jsx("line", { x1: "3", y1: "10", x2: "21", y2: "10" })] }), value: dob })] })] }), _jsxs("div", { className: styles.actions, children: [_jsx("button", { title: "Ver perfil", onClick: handleView, className: styles.actionBtn, children: _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" }), _jsx("circle", { cx: "12", cy: "12", r: "3" })] }) }), _jsx("button", { title: "Editar", onClick: handleEdit, className: styles.actionBtn, children: _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }), _jsx("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })] }) }), _jsx("button", { title: "Eliminar", onClick: handleDelete, className: `${styles.actionBtn} ${styles.danger}`, children: _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("polyline", { points: "3 6 5 6 21 6" }), _jsx("path", { d: "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" }), _jsx("path", { d: "M10 11v6M14 11v6" }), _jsx("path", { d: "M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" })] }) })] })] }));
}
function InfoRow({ icon, value }) {
    return (_jsxs("li", { className: styles.infoRow, children: [icon, _jsx("span", { className: styles.infoValue, children: value })] }));
}
