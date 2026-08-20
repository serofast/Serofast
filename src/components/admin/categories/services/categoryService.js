import { localAdminRepository } from "../../shared/localAdminRepository.js";

export function list() {
  return localAdminRepository.getState().categories;
}

export function create(name, parent = "—") {
  const trimmed = name.trim();
  const state = localAdminRepository.getState();
  if (!trimmed) throw new Error("Category name is required.");
  if (state.categories.some((item) => item.name.toLowerCase() === trimmed.toLowerCase())) {
    throw new Error("A category with this name already exists.");
  }
  const createdAt = localAdminRepository.nowIso();
  const category = { id: localAdminRepository.createId("CAT"), name: trimmed, slug: localAdminRepository.slugify(trimmed), parent, children: 0, shops: 0, products: 0, status: "Draft", position: state.categories.length, createdAt, updatedAt: createdAt };
  localAdminRepository.update((current) => ({ ...current, categories: [...current.categories, category] }));
  return category;
}

export function update(id, payload) {
  const state = localAdminRepository.getState();
  if (payload.name && state.categories.some((item) => item.id !== id && item.name.toLowerCase() === payload.name.trim().toLowerCase())) {
    throw new Error("A category with this name already exists.");
  }
  localAdminRepository.update((current) => {
    const previous = current.categories.find((item) => item.id === id);
    const category = { ...previous, ...payload, name: payload.name?.trim() ?? previous.name, slug: localAdminRepository.slugify(payload.name ?? previous.name), updatedAt: localAdminRepository.nowIso() };
    return { ...current, categories: current.categories.map((item) => item.id === id ? category : item), products: current.products.map((product) => product.categoryId === id ? { ...product, categoryName: category.name, updatedAt: localAdminRepository.nowIso() } : product) };
  });
}

export function remove(id) {
  const state = localAdminRepository.getState();
  if (state.products.some((product) => product.categoryId === id && product.status !== "Archived")) {
    throw new Error("Archive or reassign active products before deleting this category.");
  }
  localAdminRepository.update((current) => ({ ...current, categories: current.categories.filter((item) => item.id !== id) }));
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

export const categoryService = { list, create, update, remove, reorder };
