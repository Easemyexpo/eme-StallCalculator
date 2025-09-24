// Enhanced Admin API with bulk operations and analytics
import type { Request, Response, NextFunction } from 'express';
import { storage } from './storage';

// Admin authentication middleware
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Simple admin check - in production this would be more robust
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer admin-token') {
    return res.status(401).json({ error: 'Admin access required' });
  }
  next();
};

// Bulk vendor operations
export const bulkVendorOperations = {
  // Import vendors from CSV/JSON
  async importVendors(req: Request, res: Response) {
    try {
      const { vendors } = req.body;
      
      if (!Array.isArray(vendors)) {
        return res.status(400).json({ error: 'Vendors must be an array' });
      }
      
      const results = [];
      for (const vendorData of vendors) {
        try {
          const vendor = await storage.createVendor(vendorData);
          results.push({ success: true, vendor: vendor.name, id: vendor.id });
        } catch (error) {
          results.push({ success: false, vendor: vendorData.name, error: (error as Error).message });
        }
      }
      
      res.json({
        message: `Processed ${vendors.length} vendors`,
        results,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      });
      
    } catch (error) {
      console.error('Bulk import error:', error);
      res.status(500).json({ error: 'Failed to import vendors' });
    }
  },
  
  // Export vendors to JSON
  async exportVendors(req: Request, res: Response) {
    try {
      const vendors = await storage.getAllVendors();
      const activeVendors = vendors.filter((v: any) => v.isActive);
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=vendors-export.json');
      res.json({
        exportDate: new Date().toISOString(),
        totalVendors: activeVendors.length,
        vendors: activeVendors
      });
      
    } catch (error) {
      console.error('Export error:', error);
      res.status(500).json({ error: 'Failed to export vendors' });
    }
  }
};

// Vendor analytics
export const vendorAnalytics = {
  async getStats(req: Request, res: Response) {
    try {
      const vendors = await storage.getAllVendors();
      
      const stats = {
        total: vendors.length,
        active: vendors.filter((v: any) => v.isActive).length,
        inactive: vendors.filter((v: any) => !v.isActive).length,
        byCategory: {} as Record<string, number>,
        byState: {} as Record<string, number>,
        byPriceRange: {} as Record<string, number>,
        averageRating: 0,
        topRated: [] as { name: string; rating: string; category: string }[]
      };
      
      // Calculate category distribution
      vendors.forEach((vendor: any) => {
        stats.byCategory[vendor.category] = (stats.byCategory[vendor.category] || 0) + 1;
        stats.byState[vendor.state] = (stats.byState[vendor.state] || 0) + 1;
        stats.byPriceRange[vendor.priceRange] = (stats.byPriceRange[vendor.priceRange] || 0) + 1;
      });
      
      // Calculate average rating
      const ratedVendors = vendors.filter((v: any) => v.rating && v.rating !== null);
      if (ratedVendors.length > 0) {
        stats.averageRating = ratedVendors.reduce((sum: number, v: any) => sum + parseFloat(v.rating!), 0) / ratedVendors.length;
      }
      
      // Get top rated vendors
      stats.topRated = vendors
        .filter((v: any) => v.rating && v.rating !== null && v.isActive)
        .sort((a: any, b: any) => parseFloat(b.rating!) - parseFloat(a.rating!))
        .slice(0, 5)
        .map((v: any) => ({ name: v.name, rating: v.rating!, category: v.category }));
      
      res.json(stats);
      
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ error: 'Failed to get analytics' });
    }
  }
};