import { transactionRepository } from "@/repositories/transactionRepository";
import {
  paginationQueryToParams,
  type PaginationQuery,
} from "@/validators/paginationValidators";

export const transactionService = {
  getAllPaginated: (userId: string, query: PaginationQuery) => {
    const pagination = paginationQueryToParams(query);
    return transactionRepository.findManyPaginated(userId, pagination);
  },
};
