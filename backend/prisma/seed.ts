import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIES = [
    { name: 'Saree', slug: 'saree' },
    { name: 'Lehenga', slug: 'lehenga' },
    { name: 'Kurta', slug: 'kurta' },
    { name: 'Sherwani', slug: 'sherwani' },
    { name: 'Indo-Western', slug: 'indo-western' },
];

async function main() {
    console.log('🌱 Starting seed...');

    for (const category of CATEGORIES) {
        const existing = await prisma.category.findUnique({
            where: { slug: category.slug },
        });

        if (!existing) {
            await prisma.category.create({
                data: {
                    name: category.name,
                    slug: category.slug,
                    isActive: true,
                },
            });
            console.log(`Created category: ${category.name}`);
        } else {
            console.log(`Category already exists: ${category.name}`);
        }
    }

    console.log('✅ Seed completed');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
