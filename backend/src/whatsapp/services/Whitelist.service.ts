import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Whitelisted } from "../entities/Whitelistes";

@Injectable()
export class WhitelistService {
    constructor(
        @InjectRepository(Whitelisted)
        private whitelistRepository: Repository<Whitelisted>,
    ) {}

    async addToWhitelist(phone: string, userId: string) {
        const whitelisted = this.whitelistRepository.create({ phone, user: { id: userId } });
        return await this.whitelistRepository.save(whitelisted);
    }

    async removeFromWhitelist(phone: string, userId: string) {
        return await this.whitelistRepository.delete({ phone, user: { id: userId } });
    }

    async isInWhitelist(phone: string, userId: string) {
        return await this.whitelistRepository.findOne({ where: { phone, user: { id: userId } } });
    }

    async getWhitelist(userId: string) {
        return await this.whitelistRepository.find({ where: { user: { id: userId } } });
    }
    
}