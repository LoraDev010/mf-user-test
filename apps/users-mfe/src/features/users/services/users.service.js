import { httpGet } from '@/shared/lib/httpClient';
export async function fetchUsers(options = {}) {
    const { seed = 'peoplexplorer', results = 100 } = options;
    const data = await httpGet({ seed, results });
    return data.results;
}
