export const navigation = [
  { href: '/', label: 'Beranda' },
  { href: '/tentang-kami', label: 'Tentang Kami' },
  { href: '/operasi', label: 'Operasi' },
  { href: '/keberlanjutan', label: 'Keberlanjutan' },
  { href: '/proyek', label: 'Proyek' },
  { href: '/berita', label: 'Berita' },
  { href: '/karier', label: 'Karier' },
] as const;
export const site = {
  name: 'PT Ahli Maju',
  description:
    'Mengenal PT Ahli Maju dan pendekatan pertambangan yang mengutamakan keselamatan, tanggung jawab, dan nilai jangka panjang.',
  email: null,
  phone: null,
  address: null,
} as const;
export const pillars = [
  {
    title: 'Keselamatan sebagai landasan.',
    description:
      'Setiap keputusan dimulai dari keselamatan manusia. Identifikasi risiko, kesiapan tim, dan disiplin kerja menjadi fondasi pendekatan kami.',
    label: '01 / KESELAMATAN',
  },
  {
    title: 'Bertanggung jawab pada bumi.',
    description:
      'Pengelolaan sumber daya perlu mempertimbangkan air, tanah, dan kehidupan di sekitarnya, sejak perencanaan hingga pascatambang.',
    label: '02 / OPERASI BERTANGGUNG JAWAB',
  },
  {
    title: 'Tumbuh bersama masyarakat.',
    description:
      'Mendengar kebutuhan setempat dan membuka ruang dialog adalah langkah awal membangun nilai yang dapat dirasakan bersama.',
    label: '03 / NILAI BAGI MASYARAKAT',
  },
  {
    title: 'Ketelitian di setiap tahap.',
    description:
      'Perencanaan yang terukur, pengendalian proses, dan evaluasi berkelanjutan memberi arah bagi operasi yang andal.',
    label: '04 / KEUNGGULAN OPERASIONAL',
  },
] as const;
export const metrics = [
  {
    name: 'Keselamatan kerja',
    unit: 'LTIFR / jam kerja',
    method:
      'Frekuensi cedera dengan kehilangan waktu kerja dan total jam kerja terverifikasi.',
  },
  {
    name: 'Pengelolaan air',
    unit: 'm³ / tahun',
    method:
      'Volume pengambilan, penggunaan kembali, dan kualitas air berdasarkan pemantauan.',
  },
  {
    name: 'Pemulihan lahan',
    unit: 'hektare',
    method: 'Luas lahan direklamasi dan pemantauan keberhasilan vegetasi.',
  },
  {
    name: 'Pengembangan masyarakat',
    unit: 'program / penerima manfaat',
    method:
      'Cakupan program, partisipasi, serta evaluasi dampak bersama masyarakat.',
  },
] as const;
export const vacancies: { title: string; location: string; url: string }[] = [];
