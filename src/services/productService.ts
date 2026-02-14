import { Product } from '../types';
import { useStore } from '../store/useStore';

// Simulating a Supabase Client structure for the "Autonomous Execution" request
// In a real app, this would be: import { supabase } from '../lib/supabase';

export interface SearchResult extends Product {
    // Extending Product in case we need extra metadata from search
    matchType?: 'internal' | 'external' | 'description';
}

export const productService = {
    /**
     * Simulates a database search with a 300ms delay.
     * Logic: 
     *  - Internal Code: LIKE 'input%' (Prefix)
     *  - External Code: ILIKE '%input%' (Fuzzy)
     *  - Description: ILIKE '%input%' (Fuzzy)
     */
    searchProducts: async (query: string): Promise<SearchResult[]> => {
        // Access the current store state directly for local data
        // In a real app, this would be an API call
        const allProducts = useStore.getState().products;

        return new Promise((resolve) => {
            setTimeout(() => {
                const lowerQuery = query.toLowerCase();

                const results = allProducts.filter(p => {
                    const internalMatch = p.materialCode.startsWith(query);
                    const externalMatch = p.externalMaterialCode?.toLowerCase().includes(lowerQuery);
                    const descMatch = p.description.toLowerCase().includes(lowerQuery);

                    return internalMatch || externalMatch || descMatch;
                })
                    .map(p => {
                        // Determine primary match type for potential UI highlighting
                        let matchType: SearchResult['matchType'] = 'description';
                        if (p.materialCode.startsWith(query)) matchType = 'internal';
                        else if (p.externalMaterialCode?.toLowerCase().includes(lowerQuery)) matchType = 'external';

                        return { ...p, matchType };
                    })
                    .slice(0, 10); // Limit to 10 results

                resolve(results);
            }, 300); // Simulate network latency
        });
    },

    /*
     * SQL Equivalent for Supabase/PostgreSQL:
     * 
     * async function searchProductsSupabase(query: string) {
     *   const { data, error } = await supabase
     *     .from('mst_products')
     *     .select('*')
     *     .or(`int_mat_code.like.${query}%,ext_mat_code.ilike.%${query}%,product_desc_long.ilike.%${query}%`)
     *     .limit(10);
     *     
     *   if (error) throw error;
     *   return data;
     * }
     */
};
