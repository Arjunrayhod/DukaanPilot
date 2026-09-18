import { memoryStore } from '@dukaanpilot/database';
import { CategoryDTO } from '@dukaanpilot/shared';

export class CategoryService {
  static async listCategories(shopId?: string) {
    let list = Array.from(memoryStore.categories.values());
    if (shopId) {
      list = list.filter((c: any) => !c.shopId || c.shopId === shopId);
    }
    return list;
  }

  static async createCategory(data: { name: string; nameHindi?: string; icon?: string; shopId?: string }) {
    const id = 'cat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const newCat = {
      id,
      shopId: data.shopId || 'shp_demomart',
      name: data.name,
      nameHindi: data.nameHindi || data.name,
      icon: data.icon || 'box',
      displayOrder: memoryStore.categories.size + 1,
    };
    memoryStore.categories.set(id, newCat);
    return newCat;
  }
}
