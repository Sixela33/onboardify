import { Module } from '@nestjs/common';
import { WhatsappService } from './services/session.service';
import { WhatsappController } from './whatsapp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Whitelisted } from './entities/Whitelistes';
import { WhitelistService } from './services/Whitelist.service';

@Module({
  imports: [TypeOrmModule.forFeature([Whitelisted])],
  controllers: [WhatsappController],
  providers: [WhatsappService, WhitelistService],
  exports: [WhatsappService]
})
export class WhatsappModule {}
