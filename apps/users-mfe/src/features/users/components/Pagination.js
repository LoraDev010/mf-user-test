import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { motion } from 'motion/react';
import { useUsersStore } from '../store/usersStore';
import styles from './Pagination.module.scss';
export default function Pagination({ totalPages, total }) {
    const { page, pageSize, setPage } = useUsersStore();
    if (totalPages <= 1)
        return null;
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);
    const pages = buildPageRange(page, totalPages);
    return (_jsxs("div", { className: styles.root, children: [_jsxs("p", { className: styles.summary, children: ["Mostrando", ' ', _jsxs("span", { className: styles.summaryHighlight, children: [start, "\u2013", end] }), ' ', "de ", _jsx("span", { className: styles.summaryTotal, children: total }), " personas"] }), _jsxs("nav", { className: styles.nav, "aria-label": "Paginaci\u00F3n", children: [_jsx("button", { onClick: () => setPage(page - 1), disabled: page === 1, className: styles.prevNextBtn, children: "\u2190" }), pages.map((p, i) => p === '…' ? (_jsx("span", { className: styles.ellipsis, children: "\u2026" }, `ellipsis-${i}`)) : (_jsx(motion.button, { onClick: () => setPage(p), whileTap: { scale: 0.88 }, className: `${styles.pageBtn}${p === page ? ` ${styles.active}` : ''}`, children: p }, p))), _jsx("button", { onClick: () => setPage(page + 1), disabled: page === totalPages, className: styles.prevNextBtn, children: "\u2192" })] }), _jsx("div", { className: styles.accent })] }));
}
function buildPageRange(current, total) {
    if (total <= 7)
        return Array.from({ length: total }, (_, i) => i + 1);
    const pages = [1];
    if (current > 3)
        pages.push('…');
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++)
        pages.push(i);
    if (current < total - 2)
        pages.push('…');
    pages.push(total);
    return pages;
}
