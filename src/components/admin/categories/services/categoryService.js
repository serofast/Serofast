import {
  saveAdminCategory,
  deleteAdminCategory,
} from "../../../../services/adminSupabaseService";
import { localAdminRepository } from "../../shared/localAdminRepository.js";

export async function create(name, parent = "—") {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Category name is required.");
  
  // Save directly to Supabase
  const result = await saveAdminCategory({
    name: trimmed,
    group_name: parent,
  });

  // Also sync locally
  const createdAt = localAdminRepository.nowIso();
  const category = {
    id: result?.id || localAdminRepository.createId("CAT"),
    name: trimmed,
    slug: localAdminRepository.slugify(trimmed),
    parent,
    children: 0,
    shops: 0,
    products: 0,
    status: "Active",
    position: 0,
    createdAt,
    updatedAt: createdAt,
  };
  localAdminRepository.update((current) => ({
    ...current,
    categories: [...(current.categories || []), category],
  }));
  return category;
}

export async function update(id, payload) {
  await saveAdminCategory({ id, ...payload });

  localAdminRepository.update((current) => {
    const previous = current.categories.find((item) => item.id === id);
    const category = {
      ...previous,
      ...payload,
      name: payload.name?.trim() ?? previous?.name,
      slug: localAdminRepository.slugify(payload.name ?? previous?.name),
      updatedAt: localAdminRepository.nowIso(),
    };
    return {
      ...current,
      categories: current.categories.map((item) => (item.id === id ? category : item)),
    };
  });
}

export async function remove(id) {
  await deleteAdminCategory(id);
  localAdminRepository.update((current) => ({
    ...current,
    categories: current.categories.filter((item) => item.id !== id),
  }));
}

export function reorder(id, direction) {
  localAdminRepository.update((state) => {
    const categories = [...state.categories].sort((a, b) => a.position - b.position);
    const index = categories.findIndex((item) => item.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= categories.length) return state;
    [categories[index], categories[target]] = [categories[target], categories[index]];
    return { ...state, categories: categories.map((item, position) => ({ ...item, position })) };
  });
}

export const categoryService = { create, update, remove, reorder };
