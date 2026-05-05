/**
 * Image Hosts Configuration (add your image hosts here)
 */

export const imageHosts = [
    {
        protocol: 'https',
        hostname: 'images.unsplash.com',
    },
    {
        protocol: 'https',
        hostname: 'images.pexels.com',
    },
    {
        protocol: 'https',
        hostname: 'images.pixabay.com',
    },
    {
        protocol: 'https',
        hostname: 'img.rocket.new',
    },
    {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
    },

    // ✅ ADD THIS (Supabase)
    {
        protocol: 'https',
        hostname: 'zlsnfkubvxkytjkbsxeg.supabase.co',
        pathname: '/storage/v1/object/public/**',
    },
];