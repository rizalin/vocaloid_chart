import { VocadbUser } from '../../types/vocadb';
import { fetcher } from '../helper/async';
import Result from '../helper/Result';

export default class VocaDB {
  async getRawData() {
    try {
      const res = await fetcher('/api/vocadb');

      if (res.ok) {
        return Result.ok<VocadbUser[]>(res.data);
      } else {
        return Result.fail<VocadbUser[]>();
      }
    } catch (error) {
      return Result.fail<VocadbUser[]>();
    }
  }
}
