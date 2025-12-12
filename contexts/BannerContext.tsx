
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Banner } from '../types';

interface BannerContextType {
  banners: Banner[];
  updateBanner: (id: string, updates: Partial<Banner['content'] & Banner['config'] & { status: Banner['status'] }>) => void;
}

const BannerContext = createContext<BannerContextType | undefined>(undefined);

const INITIAL_BANNERS: Banner[] = [
  {
    id: 'banner-company-1',
    name: 'Homepage Trade Assurance',
    slot: 'company',
    status: 'active',
    impressions: 150234,
    clicks: 4506,
    content: {
      title: 'Trade Assurance Festival',
      subtitle: 'Protect your orders from payment to delivery with our comprehensive buyer protection program. Look for the Trade Assurance badge on listings.',
      link: '/trade-assurance',
      buttonText: 'Learn More',
      image: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?auto=format&fit=crop&w=1200&q=80',
    },
    config: {
      bgColor: 'bg-slate-800'
    }
  },
  {
    id: 'banner-showcase-1',
    name: 'Homepage Product Showcase - Energy',
    slot: 'product_showcase_1',
    status: 'active',
    impressions: 88700,
    clicks: 2100,
    content: {
      title: 'New Energy Solutions',
      subtitle: 'Source solar panels, EV chargers, and battery storage systems.',
      link: '/',
      buttonText: 'Explore Now',
      image: 'https://images.unsplash.com/photo-1625398402242-886c556811b7?auto=format&fit=crop&w=400&q=80',
    },
    config: {
      bgColor: 'bg-blue-50'
    }
  },
  {
    id: 'banner-showcase-2',
    name: 'Homepage Product Showcase - Electronics',
    slot: 'product_showcase_2',
    status: 'active',
    impressions: 92300,
    clicks: 3200,
    content: {
      title: 'Smart Electronics',
      subtitle: 'Discover the latest in IoT, wearables, and consumer tech components.',
      link: '/',
      buttonText: 'Shop IoT',
      image: 'https://picsum.photos/400/400?random=3'
    },
    config: {
      bgColor: 'bg-slate-100'
    }
  },
  {
    id: 'banner-promo-1',
    name: 'Homepage Super September',
    slot: 'promotion',
    status: 'active',
    impressions: 250000,
    clicks: 15000,
    content: {
      title: 'Super September',
      subtitle: 'Up to 40% OFF on select industrial machinery & tools.',
      link: '/',
      buttonText: 'Shop Deals Now'
    },
    config: {
      bgGradient: 'from-orange-500 to-red-500'
    }
  }
];

export const BannerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);

  const updateBanner = (id: string, updates: Partial<Banner['content'] & Banner['config'] & { status: Banner['status'] }>) => {
    setBanners(prevBanners =>
      prevBanners.map(banner => {
        if (banner.id === id) {
          const { status, ...contentAndConfig } = updates;
          // A bit of a hack to update nested objects without repeating keys
          const contentUpdates: Partial<Banner['content']> = {};
          const configUpdates: Partial<Banner['config']> = {};

          Object.keys(contentAndConfig).forEach(key => {
            if (key in (banner.content || {})) {
              (contentUpdates as any)[key] = (contentAndConfig as any)[key];
            }
            if (key in (banner.config || {})) {
              (configUpdates as any)[key] = (contentAndConfig as any)[key];
            }
          });
          
          return {
            ...banner,
            status: status ?? banner.status,
            content: { ...banner.content, ...contentUpdates },
            config: { ...banner.config, ...configUpdates }
          };
        }
        return banner;
      })
    );
  };
  
  return (
    <BannerContext.Provider value={{ banners, updateBanner }}>
      {children}
    </BannerContext.Provider>
  );
};

export const useBanners = () => {
  const context = useContext(BannerContext);
  if (!context) {
    throw new Error('useBanners must be used within a BannerProvider');
  }
  return context;
};
