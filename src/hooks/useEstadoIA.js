import { useState, useEffect, useRef } from 'react';
import { getEstadoIA } from '../api/publicacionesApi';

export const useEstadoIA = (publicacionId) => {
    const [estado, setEstado] = useState(null);
    const [intentado, setIntentado] = useState(0);
    const activeRef = useRef(true);

    useEffect(() => {
        let active = true;
        let timer = null;

        activeRef.current = true;

        async function fetchEstado() {
            try {
                const r = await getEstadoIA(publicacionId);
                if (!active) return;
                
                setEstado(r);
                
                if (!r.ia_matched && intentado < 20) { // ~60s
                    timer = setTimeout(() => setIntentado(v => v + 1), 3000);
                }
            } catch (err) {
                // si 404, no seguir poll (evita loop)
                if (err?.response?.status !== 404 && intentado < 20) {
                    timer = setTimeout(() => setIntentado(v => v + 1), 3000);
                }
            }
        }

        fetchEstado();

        return () => { 
            active = false; 
            activeRef.current = false;
            if (timer) clearTimeout(timer); 
        };
    }, [publicacionId, intentado]);

    return { estado, intentado };
};
