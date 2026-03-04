import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/lib/queryClient';
import UsersPage from '@/features/users/pages/UsersPage';
import UserDetailView from '@/features/users/components/UserDetailView';
import styles from './App.module.scss';
export default function App() {
    const [selectedUser, setSelectedUser] = useState(null);
    function handleUserSelect(user) {
        setSelectedUser(user);
        window.dispatchEvent(new CustomEvent('user:selected', { detail: user }));
    }
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsxs("div", { className: styles.wrap, children: [_jsx("header", { className: styles.header, children: _jsxs("div", { className: styles.headerInner, children: [_jsx("span", { className: styles.logoMark, children: _jsx("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: _jsx("path", { d: "M3 8.5L6.5 12L13 4", stroke: "#FFD400", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) }), _jsxs("span", { className: styles.logoText, children: ["Domina", _jsx("span", { className: styles.logoPeople, children: "People" })] })] }) }), selectedUser ? (_jsx(UserDetailView, { user: selectedUser, onBack: () => setSelectedUser(null) })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: styles.hero, children: [_jsx("div", { className: styles.heroPattern }), _jsxs("div", { className: styles.heroContent, children: [_jsx("p", { className: styles.heroLabel, children: "Directorio de Personas" }), _jsx("h1", { className: styles.heroTitle, children: "Explora el equipo" }), _jsx("p", { className: styles.heroSub, children: "100 contactos globales. Busca y filtra por nombre, correo o pa\u00EDs." })] }), _jsx("div", { className: styles.heroWave, children: _jsx("svg", { viewBox: "0 0 1440 64", fill: "none", xmlns: "http://www.w3.org/2000/svg", preserveAspectRatio: "none", children: _jsx("path", { d: "M0 64H1440V32C1200 64 960 64 720 32C480 0 240 0 0 32V64Z", fill: "white" }) }) })] }), _jsx("main", { className: styles.main, children: _jsx(UsersPage, { onUserSelect: handleUserSelect }) })] }))] }) }));
}
