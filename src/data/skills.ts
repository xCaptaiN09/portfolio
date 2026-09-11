export interface SkillGroup { index: string; title: string; tags: string[] }
export const skills: SkillGroup[] = [
  { index: '01', title: 'Systems & Android', tags: ['C', 'Linux Kernel 4.19', 'AOSP / Android Internals', 'KernelSU', 'SuSFS', 'Git', 'Bash / Fish Shell', 'AUR Packaging'] },
  { index: '02', title: 'Web Development', tags: ['JavaScript', 'React', 'Vite', 'Tailwind CSS', 'Supabase', 'GSAP', 'HTML / CSS'] },
  { index: '03', title: 'Programming', tags: ['Python in progress', 'Java', 'C++', 'SQL'] },
  { index: '04', title: 'Tools & Platforms', tags: ['GitHub Actions', 'Arch Linux', 'systemd', 'Azure / Cloud VMs'] },
]