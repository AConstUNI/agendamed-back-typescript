import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersAndDoctors1758650968149 implements MigrationInterface {
    name = 'CreateUsersAndDoctors1758650968149'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'user', 'doctor')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "doctor_register" ("id" SERIAL NOT NULL, "crm" character varying NOT NULL, "specialty" character varying NOT NULL, "phone" character varying NOT NULL, "userId" integer NOT NULL, CONSTRAINT "UQ_d0b52044b6a3eb006473a1d7c19" UNIQUE ("crm"), CONSTRAINT "REL_f930bd643aed97ced5c71070ff" UNIQUE ("userId"), CONSTRAINT "PK_ef558d37ef2f68d2cce9a6197f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "doctor_register" ADD CONSTRAINT "FK_f930bd643aed97ced5c71070ff5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctor_register" DROP CONSTRAINT "FK_f930bd643aed97ced5c71070ff5"`);
        await queryRunner.query(`DROP TABLE "doctor_register"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    }

}
