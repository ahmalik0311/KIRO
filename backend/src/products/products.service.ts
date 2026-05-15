import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  private allProducts: any[] = [];

  constructor() {
    this.logger.log('Running in LOCAL MODE — serving products from products.json');
    this.loadProducts();
  }

  private loadProducts() {
    try {
      const filePath = path.join(__dirname, '../../..', 'products.json');
      if (!fs.existsSync(filePath)) {
        this.logger.error(`products.json not found at: ${filePath}`);
        return;
      }
      const rawData = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(rawData);
      this.allProducts = data.products.map((p: any) => ({ ...p, productId: p.id }));
      this.logger.log(`Loaded ${this.allProducts.length} products`);
    } catch (e) {
      this.logger.error('Failed to load products.json:', e.message);
    }
  }

  async seed() {
    return { message: 'Seeding is disabled in Local Mode. Enable MongoDB to sync live data.' };
  }

  async findAll(page: number = 1, limit: number = 12, search?: string) {
    let products = [...this.allProducts];

    if (search && search.trim()) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.vendor?.toLowerCase().includes(q) ||
          p.tags?.some((t: string) => t.toLowerCase().includes(q)) ||
          p.handle?.toLowerCase().includes(q),
      );
    }

    const total = products.length;
    const skip = (page - 1) * limit;
    const items = products.slice(skip, skip + limit);

    return {
      items,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const numId = parseInt(id, 10);
    return this.allProducts.find((p) => p.productId === numId || p.id === numId) ?? null;
  }
}
