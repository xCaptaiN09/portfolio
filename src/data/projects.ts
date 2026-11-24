export interface Project {
  name: string
  desc: string
  meta: string[]
  url: string
  linkLabel?: string
}

const github = 'https://github.com/xCaptaiN09'

export const projects: Project[] = [
  {
    name: 'Custom Android Kernel',
    desc: 'I maintain the Linux 4.19 kernel for the Realme X7 Max. The work spans AOSP and stock ColorOS builds, KernelSU-Next integration, SuSFS backports, and boot fixes.',
    meta: ['RMX3031', 'MT6893', 'Linux 4.19'],
    url: `${github}/android_kernel_oplus_mt6893`,
  },
  {
    name: 'pixie-sddm',
    desc: 'A Material Design 3 login screen for Linux desktops, built in QML and distributed through the AUR, KDE Store, and Nix flakes.',
    meta: ['QML', 'SDDM', 'Nix'],
    url: `${github}/pixie-sddm`,
  },
  {
    name: 'hermes-hyprland-plugin',
    desc: 'A Hyprland plugin that combines compositor coordinates with Linux accessibility data so desktop automation can locate controls on Wayland.',
    meta: ['C++', 'Python', 'Wayland'],
    url: `${github}/hermes-hyprland-plugin`,
  },
  {
    name: 'Upstream contributions',
    desc: 'My Linux fingerprint work includes FocalTech FT9365 support in libfprint and a patch for SDDM that lets you use a fingerprint or password at the same login prompt.',
    meta: ['libfprint', 'SDDM', 'PAM'],
    url: 'https://github.com/sddm/sddm/pull/2176',
    linkLabel: 'Read the SDDM patch',
  },
  {
    name: 'rmx3031-archive',
    desc: 'A community archive of firmware, OTA updates, and flashing guides for Realme devices.',
    meta: ['Firmware', 'OTA', 'Android'],
    url: `${github}/rmx3031-archive`,
  },
  {
    name: 'Sortify',
    desc: 'A Magisk and KernelSU module that sorts device storage by file type, with a WebUI for choosing how files are organized.',
    meta: ['Magisk', 'KernelSU', 'WebUI'],
    url: `${github}/Sortify`,
  },
  {
    name: 'gitfox',
    desc: 'A GitHub Action for pull request reviews and issue triage. It runs a local Ollama model and keeps the review on your own machine.',
    meta: ['TypeScript', 'Ollama', 'GitHub Actions'],
    url: `${github}/gitfox`,
  },
]
