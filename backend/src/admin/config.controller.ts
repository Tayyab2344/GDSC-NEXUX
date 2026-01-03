import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ConfigService } from './config.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Correcting path based on previous knowledge

@Controller('admin/config')
export class ConfigController {
    constructor(private readonly configService: ConfigService) { }

    @Get()
    async getAll() {
        return this.configService.getAllConfigs();
    }

    @Get(':key')
    async getOne(@Param('key') key: string) {
        return this.configService.getConfig(key);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':key')
    async update(@Param('key') key: string, @Body() value: any) {
        return this.configService.updateConfig(key, value);
    }
}
