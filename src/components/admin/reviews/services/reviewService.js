export async function list(params = {}) {
  // Phase 4 service boundary. Connect this function to Supabase/API in Phase 5.
  return { data: [], error: null, params };
}

export async function getById(id) {
  return { data: null, error: null, id };
}

export async function update(id, payload) {
  return { data: { id, ...payload }, error: null };
}
