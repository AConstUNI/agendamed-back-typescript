import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersAndDoctors1761587518187 implements MigrationInterface {
    name = 'CreateUsersAndDoctors1761587518187'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'user', 'doctor', 'atendent')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "doctor_register" ("id" SERIAL NOT NULL, "crm" character varying NOT NULL, "specialty" character varying NOT NULL, "phone" character varying NOT NULL, "userId" integer NOT NULL, CONSTRAINT "UQ_d0b52044b6a3eb006473a1d7c19" UNIQUE ("crm"), CONSTRAINT "REL_f930bd643aed97ced5c71070ff" UNIQUE ("userId"), CONSTRAINT "PK_ef558d37ef2f68d2cce9a6197f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "admin_log" ("id" SERIAL NOT NULL, "adminEmail" character varying NOT NULL, "action" character varying NOT NULL, "target" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_42b80ec4239a2d6ee856b340db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "agendamento" ("id" SERIAL NOT NULL, "pacienteId" integer NOT NULL, "medicoId" integer NOT NULL, "data" character varying NOT NULL, "hora" character varying NOT NULL, "sala" character varying NOT NULL, "telefone" character varying NOT NULL, CONSTRAINT "PK_a102b15cfec9ce6d8ac6193345f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "doctor_register" ADD CONSTRAINT "FK_f930bd643aed97ced5c71070ff5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "agendamento" ADD CONSTRAINT "FK_bdc31f2d4faf6a677a9870dad8e" FOREIGN KEY ("pacienteId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "agendamento" ADD CONSTRAINT "FK_6457e818ae8ca1121eda19459b1" FOREIGN KEY ("medicoId") REFERENCES "doctor_register"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "agendamento" DROP CONSTRAINT "FK_6457e818ae8ca1121eda19459b1"`);
        await queryRunner.query(`ALTER TABLE "agendamento" DROP CONSTRAINT "FK_bdc31f2d4faf6a677a9870dad8e"`);
        await queryRunner.query(`ALTER TABLE "doctor_register" DROP CONSTRAINT "FK_f930bd643aed97ced5c71070ff5"`);
        await queryRunner.query(`DROP TABLE "agendamento"`);
        await queryRunner.query(`DROP TABLE "admin_log"`);
        await queryRunner.query(`DROP TABLE "doctor_register"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    }

}
