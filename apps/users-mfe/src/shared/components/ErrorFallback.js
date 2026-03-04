import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './ErrorFallback.module.scss';
export default function ErrorFallback({ error }) {
    return (_jsxs("div", { className: styles.wrap, children: [_jsx("p", { className: styles.msg, children: "Algo sali\u00F3 mal" }), _jsx("p", { className: styles.detail, children: error.message })] }));
}
