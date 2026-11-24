export interface Client { index: string; name: string; url: string; desc: string; meta: string[] }
export const clients: Client[] = [
  { index: '01', url: 'https://github.com/xCaptaiN09/ak-enterprises-shop', name: 'Battery Shop CRM', desc: 'Custom CRM for a retail business covering sales tracking, service ticket management, inventory, and role-based staff access control.', meta: ['React', 'Supabase', 'Tailwind CSS'] },
  { index: '02', url: 'https://ashif-risvana-wedding-invitation.vercel.app', name: 'Interactive Wedding Invitation', desc: 'Scroll-driven wedding invitation site featuring a custom 3D envelope-opening animation, video scrubbing, and integrated venue maps.', meta: ['Vite', 'GSAP', 'Three.js'] },
]