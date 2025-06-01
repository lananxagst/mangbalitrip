import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Hapus data yang ada (opsional)
  await prisma.review.deleteMany({});
  await prisma.package.deleteMany({});
  await prisma.destination.deleteMany({});
  await prisma.hotel.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding database...');

  // Seed Destinations
  const destinations = await Promise.all([
    prisma.destination.create({
      data: {
        name: 'Bali',
        description: 'Pulau dewata dengan pantai indah dan budaya yang kaya.',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
        location: 'Indonesia',
        rating: 4.8,
        price: 500,
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Lombok',
        description: 'Keindahan alam yang masih asri dengan pantai-pantai eksotis.',
        image: 'https://images.unsplash.com/photo-1622635023663-3e164b56e7b2',
        location: 'Indonesia',
        rating: 4.7,
        price: 450,
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Raja Ampat',
        description: 'Surga bawah laut dengan keanekaragaman hayati yang luar biasa.',
        image: 'https://images.unsplash.com/photo-1573790387438-4da905039392',
        location: 'Papua, Indonesia',
        rating: 4.9,
        price: 800,
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Labuan Bajo',
        description: 'Rumah bagi Komodo dan pemandangan laut yang memukau.',
        image: 'https://images.unsplash.com/photo-1518548419970-58cd00b85ff3',
        location: 'Nusa Tenggara Timur, Indonesia',
        rating: 4.6,
        price: 600,
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Yogyakarta',
        description: 'Kota budaya dengan Candi Borobudur dan tradisi Jawa yang kental.',
        image: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa',
        location: 'Jawa Tengah, Indonesia',
        rating: 4.5,
        price: 300,
      },
    }),
  ]);

  console.log(`Seeded ${destinations.length} destinations`);

  // Seed Hotels
  const hotels = await Promise.all([
    prisma.hotel.create({
      data: {
        name: 'Grand Hyatt Bali',
        description: 'Hotel mewah dengan pemandangan pantai yang spektakuler.',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        location: 'Bali, Indonesia',
        rating: 4.8,
        price: 300,
      },
    }),
    prisma.hotel.create({
      data: {
        name: 'Sheraton Senggigi Beach Resort',
        description: 'Resort tepi pantai dengan pemandangan sunset yang menakjubkan.',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
        location: 'Lombok, Indonesia',
        rating: 4.7,
        price: 250,
      },
    }),
    prisma.hotel.create({
      data: {
        name: 'Papua Paradise Eco Resort',
        description: 'Eco resort yang dikelilingi keindahan alam Raja Ampat.',
        image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2',
        location: 'Raja Ampat, Indonesia',
        rating: 4.9,
        price: 400,
      },
    }),
  ]);

  console.log(`Seeded ${hotels.length} hotels`);

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
