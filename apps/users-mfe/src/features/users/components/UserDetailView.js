import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './UserDetailView.module.scss';
function InfoCard({ title, items, }) {
    return (_jsxs("div", { className: styles.infoCard, children: [_jsx("div", { className: styles.infoCardBar }), _jsxs("div", { className: styles.infoCardBody, children: [_jsx("h3", { className: styles.infoCardTitle, children: title }), _jsx("ul", { className: styles.infoItemList, children: items.map(({ label, value, accent, mono }) => (_jsxs("li", { className: styles.infoItem, children: [_jsx("p", { className: styles.infoItemLabel, children: label }), _jsx("p", { className: [
                                        styles.infoItemValue,
                                        accent ? styles.accent : mono ? styles.mono : '',
                                    ]
                                        .filter(Boolean)
                                        .join(' '), children: value })] }, label))) })] })] }));
}
export default function UserDetailView({ user, onBack }) {
    const fullName = `${user.name.first} ${user.name.last}`;
    const dob = user.dob?.date
        ? new Date(user.dob.date).toLocaleDateString('es-CO', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
        : '—';
    return (_jsxs("div", { children: [_jsxs("div", { className: styles.heroHeader, children: [_jsx("div", { className: styles.accentBar }), _jsxs("div", { className: styles.headerInner, children: [_jsxs("div", { className: styles.headerLeft, children: [_jsx("div", { className: styles.headerIconWrap, children: _jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "#FFD400", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }), _jsx("circle", { cx: "9", cy: "7", r: "4" }), _jsx("path", { d: "M23 21v-2a4 4 0 0 0-3-3.87" }), _jsx("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })] }) }), _jsx("h1", { className: styles.headerTitle, children: "Perfil de Usuario" })] }), _jsxs("button", { onClick: onBack, className: styles.backBtn, children: [_jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M19 12H5M12 5l-7 7 7 7" }) }), "Volver"] })] })] }), _jsxs("div", { className: styles.content, children: [_jsxs("div", { className: styles.profileCard, children: [_jsx("div", { className: styles.profileAvatar, children: _jsx("img", { src: user.picture.large, alt: fullName, className: styles.profileAvatarImg }) }), _jsxs("div", { children: [_jsx("h2", { className: styles.profileName, children: fullName }), _jsxs("p", { className: styles.profileAge, children: [user.dob?.age, " a\u00F1os"] })] })] }), _jsxs("div", { className: styles.infoGrid, children: [_jsx(InfoCard, { title: "Informaci\u00F3n de Contacto", items: [
                                    { label: 'EMAIL', value: user.email, accent: true },
                                    { label: 'TELÉFONO', value: user.phone, accent: true },
                                    { label: 'FECHA DE NACIMIENTO', value: dob },
                                ] }), _jsx(InfoCard, { title: "Informaci\u00F3n Personal", items: [
                                    { label: 'NOMBRE', value: user.name.first },
                                    { label: 'APELLIDO', value: user.name.last },
                                    { label: 'GÉNERO', value: user.gender === 'male' ? 'Masculino' : 'Femenino' },
                                ] }), _jsx(InfoCard, { title: "Informaci\u00F3n del Sistema", items: [
                                    { label: 'ID DEL USUARIO', value: user.login.uuid, mono: true },
                                    { label: 'ALMACENAMIENTO', value: 'Los datos se guardan en localStorage del navegador' },
                                    { label: 'PRIVACIDAD', value: 'Todos los datos permanecen en tu navegador' },
                                ] })] })] })] }));
}
