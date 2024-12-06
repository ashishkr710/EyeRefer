import { Request, Response } from 'express';
import Notification from '../models/notification';

export const getNotificationsByReceiverId = async (req: Request, res: Response): Promise<void> => {
    try {
        const receiver_id = req.params.receiver_id;
        const notifications = await Notification.findAll({ where: { receiver_id: receiver_id } });

        if (!notifications || notifications.length === 0) {
            res.status(404).json({ message: 'No notifications found for this receiver ID' });
            return;
        }

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
