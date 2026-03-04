import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import UserSearch from '../components/UserSearch';
import UserList from '../components/UserList';
import Pagination from '../components/Pagination';
import UserFormModal from '../components/UserFormModal';
import styles from './UsersPage.module.scss';
export default function UsersPage({ onUserSelect }) {
    const { totalPages, total, isFetching } = useUsers();
    const [modalOpen, setModalOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    function handleNewUser() {
        setEditUser(null);
        setModalOpen(true);
    }
    function handleEdit(user) {
        setEditUser(user);
        setModalOpen(true);
    }
    function handleClose() {
        setModalOpen(false);
        setEditUser(null);
    }
    return (_jsxs("div", { className: styles.root, children: [_jsxs("div", { className: styles.searchRow, children: [_jsx("div", { className: styles.searchWrap, children: _jsx(UserSearch, {}) }), isFetching && (_jsx("span", { className: styles.syncing, children: "Syncing\u2026" }))] }), _jsx(UserList, { onUserSelect: onUserSelect, onEdit: handleEdit, onNewUser: handleNewUser, total: total }), _jsx(Pagination, { totalPages: totalPages, total: total }), _jsx(UserFormModal, { open: modalOpen, editUser: editUser, onClose: handleClose })] }));
}
