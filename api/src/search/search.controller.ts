// src/search/search.controller.ts
import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get('professionals')
  searchProfessionals(
    @Query('category') category?: string,
    @Query('city') city?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.searchService.searchProfessionals(
      category,
      city,
      parseInt(page) || 1,
      parseInt(limit) || 20,
    );
  }

  @Get('categories')
  getCategories() {
    return this.searchService.getCategories();
  }

  @Get('cities')
  getCities() {
    return this.searchService.getCities();
  }
}