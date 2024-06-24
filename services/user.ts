import User from "../models/userModel";

export const findUserType = async (userId: string) => {
    try {
        // const userId = req.userId;
        const user = await User.findOne({ _id: userId })
        return user
    } catch (error) {
        throw error;
    }
}