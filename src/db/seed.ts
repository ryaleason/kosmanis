import type {
  NewProperty,
  NewRoomType,
  NewRoom,
  NewProfile,
  NewTenant,
  NewLease,
  NewInvoice,
  NewPayment,
  NewSurveySlot,
} from './schema';

export function getSeedData() {
  const propertyId = 'e2a6e088-3e4b-4b2a-8888-000000000001';
  const typeAcId = 'e2a6e088-3e4b-4b2a-8888-000000000002';
  const typeDeluxeId = 'e2a6e088-3e4b-4b2a-8888-000000000003';

  const property: NewProperty = {
    id: propertyId,
    name: 'Kos Manis',
    slug: 'kos-manis',
    category: 'campur',
    description:
      'Kos eksklusif, aman, dan nyaman di lokasi strategis. Dekat kampus, perkantoran, dan fasilitas umum dengan akses 24 jam.',
    address: 'Jl. Kenanga No. 12, Sukajadi',
    city: 'Bandung',
    whatsappNumber: '081234567890',
    rules: [
      'Dilarang merokok di dalam kamar ber-AC',
      'Tamu lawan jenis dilarang menginap di kamar',
      'Jam tenang berlaku mulai pukul 22.00 WIB',
      'Wajib menjaga kebersihan dapur dan area bersama',
      'Kunci gerbang harap selalu dikunci kembali saat malam',
    ],
    facilities: [
      'WiFi Cepat 100 Mbps',
      'Dapur Bersama & Kulkas',
      'Dispenser Air Minum Gratis',
      'Area Parkir Motor & Mobil Berkanopi',
      'CCTV Keamanan 24 Jam',
      'Mesin Cuci Bersama',
    ],
    qrisImageUrl: '/images/qris-statis.png',
    bankAccounts: [
      {
        bankName: 'BCA',
        accountNumber: '8220192831',
        accountHolder: 'Budi Hartono (Pemilik Kos)',
      },
      {
        bankName: 'Bank Mandiri',
        accountNumber: '1310082736192',
        accountHolder: 'Budi Hartono (Pemilik Kos)',
      },
    ],
  };

  const roomTypes: NewRoomType[] = [
    {
      id: typeAcId,
      propertyId,
      name: 'Kamar Standard AC',
      description: 'Kamar nyaman ukuran 3x3.5m dengan AC, kasur springbed, lemari pakaian, dan meja belajar.',
      facilities: ['AC', 'Kamar Mandi Dalam', 'Kasur Springbed', 'Lemari Pakaian', 'Meja & Kursi Kerja'],
      basePrice: 1500000,
      depositAmount: 500000,
      electricityMode: 'termasuk_sewa',
    },
    {
      id: typeDeluxeId,
      propertyId,
      name: 'Kamar Deluxe Queen',
      description: 'Kamar luas ukuran 4x4m dengan kasur queen size, smart TV, water heater, dan balkon pribadi.',
      facilities: ['AC', 'Water Heater', 'Smart TV', 'Kamar Mandi Dalam', 'Balkon Pribadi', 'Kasur Queen'],
      basePrice: 2100000,
      depositAmount: 500000,
      electricityMode: 'termasuk_sewa',
    },
  ];

  const rooms: NewRoom[] = [
    {
      id: 'e2a6e088-3e4b-4b2a-8888-000000000101',
      propertyId,
      roomTypeId: typeAcId,
      roomNumber: '101',
      floor: 1,
      status: 'terisi',
      images: ['/images/rooms/101-1.jpg', '/images/rooms/101-2.jpg'],
      notes: 'Dekat gerbang depan',
    },
    {
      id: 'e2a6e088-3e4b-4b2a-8888-000000000102',
      propertyId,
      roomTypeId: typeAcId,
      roomNumber: '102',
      floor: 1,
      status: 'terisi',
      images: ['/images/rooms/102-1.jpg'],
    },
    {
      id: 'e2a6e088-3e4b-4b2a-8888-000000000103',
      propertyId,
      roomTypeId: typeAcId,
      roomNumber: '103',
      floor: 1,
      status: 'segera_kosong',
      images: ['/images/rooms/103-1.jpg'],
      notes: 'Kontrak habis akhir bulan',
    },
    {
      id: 'e2a6e088-3e4b-4b2a-8888-000000000104',
      propertyId,
      roomTypeId: typeAcId,
      roomNumber: '104',
      floor: 1,
      status: 'kosong',
      images: ['/images/rooms/104-1.jpg'],
    },
    {
      id: 'e2a6e088-3e4b-4b2a-8888-000000000201',
      propertyId,
      roomTypeId: typeDeluxeId,
      roomNumber: '201',
      floor: 2,
      status: 'terisi',
      images: ['/images/rooms/201-1.jpg'],
    },
    {
      id: 'e2a6e088-3e4b-4b2a-8888-000000000202',
      propertyId,
      roomTypeId: typeDeluxeId,
      roomNumber: '202',
      floor: 2,
      status: 'kosong',
      images: ['/images/rooms/202-1.jpg'],
    },
  ];

  const profiles: NewProfile[] = [
    {
      id: 'e2a6e088-3e4b-4b2a-8888-000000000010',
      propertyId,
      role: 'pemilik',
      fullName: 'Budi Hartono',
      phoneNumber: '081234567890',
    },
    {
      id: 'e2a6e088-3e4b-4b2a-8888-000000000020',
      propertyId,
      role: 'admin',
      fullName: 'Sari Handayani',
      phoneNumber: '081298765432',
    },
    {
      id: 'e2a6e088-3e4b-4b2a-8888-000000000030',
      propertyId,
      role: 'penghuni',
      fullName: 'Dika Pratama',
      phoneNumber: '085712345678',
    },
  ];

  const tenants: NewTenant[] = [
    {
      id: 'e2a6e088-3e4b-4b2a-8888-000000000301',
      propertyId,
      profileId: 'e2a6e088-3e4b-4b2a-8888-000000000030',
      name: 'Dika Pratama',
      idCardNumber: '3273012304950001',
      phoneNumber: '085712345678',
      emergencyContactName: 'Ayah Dika',
      emergencyContactPhone: '081122334455',
      status: 'aktif',
    },
    {
      id: 'e2a6e088-3e4b-4b2a-8888-000000000302',
      propertyId,
      name: 'Rian Firdaus',
      idCardNumber: '3273011508980002',
      phoneNumber: '081399887766',
      emergencyContactName: 'Ibu Rian',
      emergencyContactPhone: '081311223344',
      status: 'aktif',
    },
  ];

  const leases: NewLease[] = [
    {
      id: 'e2a6e088-3e4b-4b2a-8888-000000000401',
      propertyId,
      tenantId: 'e2a6e088-3e4b-4b2a-8888-000000000301',
      roomId: 'e2a6e088-3e4b-4b2a-8888-000000000101',
      startDate: new Date('2026-08-01T00:00:00Z'),
      endDate: new Date('2027-08-01T00:00:00Z'),
      rentAmount: 1500000, // Snapshot
      depositAmount: 500000, // Snapshot
      dueDay: 5,
      status: 'aktif',
    },
    {
      id: 'e2a6e088-3e4b-4b2a-8888-000000000402',
      propertyId,
      tenantId: 'e2a6e088-3e4b-4b2a-8888-000000000302',
      roomId: 'e2a6e088-3e4b-4b2a-8888-000000000201',
      startDate: new Date('2026-09-01T00:00:00Z'),
      endDate: new Date('2027-09-01T00:00:00Z'),
      rentAmount: 2100000, // Snapshot
      depositAmount: 500000, // Snapshot
      dueDay: 1,
      status: 'aktif',
    },
  ];

  const invoices: NewInvoice[] = [
    {
      id: 'e2a6e088-3e4b-4b2a-8888-000000000501',
      propertyId,
      leaseId: 'e2a6e088-3e4b-4b2a-8888-000000000401',
      invoiceNumber: 'INV-202611-101',
      periodMonth: 11,
      periodYear: 2026,
      amount: 1500000,
      status: 'lunas',
      dueDate: new Date('2026-11-05T00:00:00Z'),
      token: 'tok_sample_dika_nov_2026_verified',
    },
    {
      id: 'e2a6e088-3e4b-4b2a-8888-000000000502',
      propertyId,
      leaseId: 'e2a6e088-3e4b-4b2a-8888-000000000402',
      invoiceNumber: 'INV-202611-201',
      periodMonth: 11,
      periodYear: 2026,
      amount: 2100000,
      status: 'menunggu_verifikasi',
      dueDate: new Date('2026-11-01T00:00:00Z'),
      token: 'tok_sample_rian_nov_2026_pending',
    },
  ];

  const payments: NewPayment[] = [
    {
      id: 'e2a6e088-3e4b-4b2a-8888-000000000601',
      propertyId,
      invoiceId: 'e2a6e088-3e4b-4b2a-8888-000000000501',
      amount: 1500000,
      paymentMethod: 'transfer_manual',
      proofImageUrl: '/proofs/sample-bca-transfer.jpg',
      status: 'diterima',
      verifiedBy: 'e2a6e088-3e4b-4b2a-8888-000000000020',
      verifiedAt: new Date('2026-11-04T10:00:00Z'),
    },
    {
      id: 'e2a6e088-3e4b-4b2a-8888-000000000602',
      propertyId,
      invoiceId: 'e2a6e088-3e4b-4b2a-8888-000000000502',
      amount: 2100000,
      paymentMethod: 'qris_statis',
      proofImageUrl: '/proofs/sample-qris-proof.jpg',
      status: 'menunggu_verifikasi',
    },
  ];

  const surveySlots: NewSurveySlot[] = [
    {
      id: 'e2a6e088-3e4b-4b2a-8888-000000000701',
      propertyId,
      date: '2026-11-10',
      timeSlot: '10:00 - 11:00 WIB',
      quota: 3,
      bookedCount: 1,
    },
    {
      id: 'e2a6e088-3e4b-4b2a-8888-000000000702',
      propertyId,
      date: '2026-11-10',
      timeSlot: '14:00 - 15:00 WIB',
      quota: 3,
      bookedCount: 0,
    },
  ];

  return {
    property,
    roomTypes,
    rooms,
    profiles,
    tenants,
    leases,
    invoices,
    payments,
    surveySlots,
  };
}

export async function seedDatabase() {
  console.log('Seeding Kosmanis database...');
  // Running seed function when connected to real DB
}
