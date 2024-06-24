import { Model } from 'mongoose';

interface PaginateOptions {
    page: number;
    limit: number;
}

export const paginate = async (model: Model<any>, options: PaginateOptions) => {
    const { page, limit } = options;

    const documents = await model.find()
        .skip((page - 1) * limit)
        .limit(limit);

    const total = await model.countDocuments();

    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        documents
    };
};
