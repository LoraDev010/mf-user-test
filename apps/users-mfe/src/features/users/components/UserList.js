import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '@/shared/components/ErrorFallback';
import { useUsers } from '../hooks/useUsers';
import { useUsersStore } from '../store/usersStore';
import UserCard from './UserCard';
import styles from './UserList.module.scss';
export default function UserList({ onUserSelect, onEdit, onNewUser, total }) {
    const { users, isLoading } = useUsers();
    const localUsers = useUsersStore((s) => s.localUsers);
    const localUuids = new Set(localUsers.map((u) => u.login.uuid));
    if (isLoading) {
        return (_jsxs(_Fragment, { children: [_jsx(ListHeader, { total: 0, onNewUser: onNewUser, loading: true }), _jsx("div", { className: styles.grid, "aria-busy": "true", "aria-label": "Cargando personas", children: Array.from({ length: 12 }).map((_, i) => (_jsx("div", { className: styles.skeleton, style: { animationDelay: `${i * 50}ms` }, children: _jsx("div", { className: styles.skeletonBar }) }, i))) })] }));
    }
    if (!users.length) {
        return (_jsxs(_Fragment, { children: [_jsx(ListHeader, { total: total, onNewUser: onNewUser }), _jsxs("div", { className: styles.empty, children: [_jsx("p", { className: styles.emptyText, children: "No se encontraron personas con esa b\u00FAsqueda." }), _jsx("p", { className: styles.emptyHint, children: "Intenta con otro nombre, correo o pa\u00EDs." })] })] }));
    }
    return (_jsxs(ErrorBoundary, { FallbackComponent: ({ error }) => _jsx(ErrorFallback, { error: error }), children: [_jsx(ListHeader, { total: total, onNewUser: onNewUser }), _jsx("div", { className: styles.grid, children: users.map((user, i) => (_jsx(UserCard, { user: user, index: i, onSelect: onUserSelect, onEdit: onEdit, isLocal: localUuids.has(user.login.uuid) }, user.login.uuid))) })] }));
}
function ListHeader({ total, onNewUser, loading, }) {
    return (_jsxs("div", { className: styles.header, children: [_jsxs("div", { className: styles.headerLeft, children: [_jsx("div", { className: styles.headerIcon, children: _jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "#1400CC", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }), _jsx("circle", { cx: "9", cy: "7", r: "4" }), _jsx("path", { d: "M23 21v-2a4 4 0 0 0-3-3.87" }), _jsx("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })] }) }), _jsxs("div", { children: [_jsx("h2", { className: styles.headerTitle, children: "Listado de Usuarios" }), !loading && (_jsxs("p", { className: styles.headerCount, children: [total, " usuarios registrados"] }))] })] }), _jsxs("button", { onClick: onNewUser, className: styles.btnNew, children: [_jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", children: [_jsx("line", { x1: "12", y1: "5", x2: "12", y2: "19" }), _jsx("line", { x1: "5", y1: "12", x2: "19", y2: "12" })] }), "Nuevo Usuario"] })] }));
}
