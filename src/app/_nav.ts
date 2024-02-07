import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
    // badge: {
    //   variant: 'info',
    //   text: 'NEW',
    // },
  },
  {
    name: 'Buku Besar',
    url: '/gl',
    icon: 'fa fa-list-alt',
    attributes: { authorities: ['ROLE_AKUNTING'] },
    children: [
      {
        name: '  Bukti Jurnal Umum',
        url: '/gl/entri-jurnal',
        icon: 'cil-scrubber',
        attributes: { authorities: ['ROLE_AKUNTING'] },
      },
      {
        name: '  Bukti Kas Masuk',
        url: '/gl/bkm',
        icon: 'cil-scrubber',
        attributes: { authorities: ['ROLE_AKUNTING'] },
      },
      {
        name: '  Bukti Kas Keluar',
        url: '/gl/bkk',
        icon: 'cil-scrubber',
        attributes: { authorities: ['ROLE_AKUNTING'] },
      },
      {
        name: '  Lap. Keuangan',
        url: '/gl/report',
        icon: 'cil-scrubber',
        attributes: { authorities: ['ROLE_AKUNTING'] },
      },
    ],
  },
  {
    name: 'Daftar',
    url: '/daftar',
    icon: 'fa fa-calculator',
    attributes: { authorities: ['ROLE_AKUNTING'] },
    children: [
      {
        name: 'Bukti Jurnal Umum',
        url: '/daftar/bukti-jurnal',
        icon: 'cil-scrubber',
        attributes: { authorities: ['ROLE_AKUNTING'] },
      },
      {
        name: 'Bukti Kas Keluar',
        url: '/daftar/bkk',
        icon: 'cil-scrubber',
        attributes: { authorities: ['ROLE_AKUNTING'] },
      },
      {
        name: 'Bukti Kas Masuk',
        url: '/daftar/bkm',
        icon: 'cil-scrubber',
        attributes: { authorities: ['ROLE_AKUNTING'] },
      },
      {
        name: 'Tipe F.A Pajak',
        url: '/daftar/fa-tipe-pajak',
        icon: 'cil-scrubber',
        attributes: { authorities: ['ROLE_AKUNTING'] },
      },
      {
        name: 'Tipe Fix Aset',
        url: '/daftar/fa-tipe',
        icon: 'cil-scrubber',
        attributes: { authorities: ['ROLE_AKUNTING'] },
      },
      {
        name: 'Daftar Fix Aset',
        url: '/daftar/fixasset/list',
        icon: 'cil-scrubber',
        attributes: { authorities: ['ROLE_AKUNTING'] },
      },
      {
        name: 'Departemen',
        url: '/daftar/department',
        icon: 'cil-scrubber',
        attributes: { authorities: ['ROLE_AKUNTING'] },
      },
      {
        name: 'Daftar Akun',
        url: '/daftar/daftar-akun',
        icon: 'cil-scrubber',
        attributes: { authorities: ['ROLE_AKUNTING'] },
      },
      {
        name: 'Kode Pajak',
        url: '/daftar/kode-pajak',
        icon: 'cil-scrubber',
        attributes: { authorities: ['ROLE_AKUNTING'] },
      },
    ],
  },
  {
    name: 'Pengaturan',
    url: '/icons',
    icon: 'fa fa-link',
    // attributes: { authorities: ['ROLE_ADMIN'] },
    children: [
      {
        name: 'Default Akun',
        url: '/pengaturan/default-akun',
        icon: 'cil-scrubber',
      },
      {
        name: 'Manajemen User',
        url: '/pengaturan/user-management',
        icon: 'icon-cil-scrubber',
        attributes: { authorities: ['ROLE_ADMIN'] },
      }
    ],
  }
];
