// src/seeds/seed-admin.ts
import 'reflect-metadata';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from 'ormconfig';
import { User, UserRole } from '../usuarios/entities/usuario.entity';

async function seedAdmin() {
  await AppDataSource.initialize();
  const userRepository = AppDataSource.getRepository(User);

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';

  let admin = await userRepository.findOne({ where: { email: adminEmail } });

  if (admin) {
    console.log('✅ Admin already exists:', adminEmail);
  } else {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    admin = userRepository.create({
      name: 'Administrador',
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.ADMIN, // 👈 adapt this to your User entity (could be isAdmin: true)
    });

    await userRepository.save(admin);
    console.log('🌱 Admin user created successfully:', adminEmail);
  }

  await AppDataSource.destroy();
}

seedAdmin()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error seeding admin:', err);
    process.exit(1);
  });
