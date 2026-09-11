export interface Client { index: string; name: string; desc: string; meta: string[] }
export const clients: Client[] = [
  { index: '01', name: 'Battery Shop CRM', desc: 'Custom CRM for a retail business covering sales tracking, service ticket management, inventory, and role-based staff access control.', meta: ['React', 'Supabase', 'Tailwind CSS'] },
  { index: '02', name: 'Interactive Wedding Invitation', desc: 'Scroll-driven wedding invitation site featuring a custom 3D envelope-opening animation, video scrubbing, and integrated venue maps.', meta: ['Vite', 'GSAP', 'Three.js'] },
]