// sync.js — Camada de dados inteligente
// Tenta Supabase primeiro; se as tabelas não existirem, usa localStorage.
// Quando as tabelas forem criadas, passa a sincronizar automaticamente.

const SB_URL = 'https://wtwsvzroknzhmpqqwfdi.supabase.co';
const SB_KEY = 'sb_publishable_Il4W2ZijsQXIX3OiY0GpQw_fft5L46C';
const SB_HEADERS = { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY, 'Content-Type': 'application/json' };

let _sbAvailable = null; // null = ainda não testou, true/false = resultado

async function sbCheck() {
    if (_sbAvailable !== null) return _sbAvailable;
    try {
        const r = await fetch(SB_URL + '/rest/v1/vehicles?select=id&limit=1', { headers: SB_HEADERS });
        const data = await r.json();
        _sbAvailable = !data.code; // se tem 'code', é erro (tabela não existe)
    } catch (e) { _sbAvailable = false; }
    return _sbAvailable;
}

// ==================== GENERIC CRUD ====================

async function dbGet(table) {
    if (await sbCheck()) {
        const r = await fetch(SB_URL + '/rest/v1/' + table + '?select=*', { headers: SB_HEADERS });
        return await r.json();
    }
    return JSON.parse(localStorage.getItem('carleilao_' + table) || '[]');
}

async function dbInsert(table, data) {
    if (await sbCheck()) {
        await fetch(SB_URL + '/rest/v1/' + table, {
            method: 'POST', headers: { ...SB_HEADERS, 'Prefer': 'return=minimal' },
            body: JSON.stringify(data)
        });
    } else {
        const arr = JSON.parse(localStorage.getItem('carleilao_' + table) || '[]');
        arr.push(data);
        localStorage.setItem('carleilao_' + table, JSON.stringify(arr));
    }
}

async function dbInsertBatch(table, items) {
    if (await sbCheck()) {
        for (const item of items) {
            await fetch(SB_URL + '/rest/v1/' + table, {
                method: 'POST', headers: { ...SB_HEADERS, 'Prefer': 'return=minimal' },
                body: JSON.stringify(item)
            });
        }
    } else {
        const arr = JSON.parse(localStorage.getItem('carleilao_' + table) || '[]');
        arr.push(...items);
        localStorage.setItem('carleilao_' + table, JSON.stringify(arr));
    }
}

async function dbUpdate(table, filter, data) {
    if (await sbCheck()) {
        await fetch(SB_URL + '/rest/v1/' + table + '?' + filter, {
            method: 'PATCH', headers: { ...SB_HEADERS, 'Prefer': 'return=minimal' },
            body: JSON.stringify(data)
        });
    } else {
        // localStorage: parse filter para encontrar item
        const arr = JSON.parse(localStorage.getItem('carleilao_' + table) || '[]');
        const match = filter.match(/id=eq\.(\d+)/);
        if (match) {
            const idx = arr.findIndex(x => String(x.id) === match[1]);
            if (idx >= 0) arr[idx] = { ...arr[idx], ...data };
        }
        localStorage.setItem('carleilao_' + table, JSON.stringify(arr));
    }
}

async function dbDelete(table, filter) {
    if (await sbCheck()) {
        await fetch(SB_URL + '/rest/v1/' + table + '?' + filter, {
            method: 'DELETE', headers: { ...SB_HEADERS, 'Prefer': 'return=minimal' }
        });
    } else {
        const arr = JSON.parse(localStorage.getItem('carleilao_' + table) || '[]');
        const match = filter.match(/id=eq\.(\d+)/);
        if (match) {
            const filtered = arr.filter(x => String(x.id) !== match[1]);
            localStorage.setItem('carleilao_' + table, JSON.stringify(filtered));
        }
    }
}
