import { jsx as _jsx } from "react/jsx-runtime";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/lib/queryClient';
import UsersPage from './pages/UsersPage';
const UsersFeature = ({ onUserSelect }) => (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(UsersPage, { onUserSelect: onUserSelect }) }));
export default UsersFeature;
