import { UpdateCatDto } from './dto/update-cat.dto';
import { CreateCatDto } from './dto/create-cat.dto';

export class CatService {
  create(createCatDto: CreateCatDto) {
    console.log(`This action adds a new cat #${JSON.stringify(createCatDto)}`);
    return true;
  }

  findAll(query: any) {
    return `This action returns all cats #${JSON.stringify(query)}`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cat`;
  }

  update(id: number, updateCatDto: UpdateCatDto) {
    return `This action updates a #${id} cat #${JSON.stringify(updateCatDto)}`;
  }

  remove(id: number) {
    return `This action removes a #${id} cat`;
  }
}
