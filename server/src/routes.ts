import { Request, Response, Router } from "express";
import userControllers from "./controllers/UserControllers";
import { authMiddleware } from "./middleware/auth";
import userServices from "./services/UserServices";
import reservationController from "./controllers/ReservationController";
import reservationServices from "./services/ReservationServices";
import notificationController from "./controllers/NotificationController";
import notificationServices from "./services/NotificationServices";
import { adminAuthMiddleware } from "./middleware/adminAuth";
import coworkingController from "./controllers/CoworkingController";
import coworkingServices from "./services/CoworkingServices";
import paymentController from "./controllers/PaymentController";
import paymentServices from "./services/PaymentServices";
import reviewController from "./controllers/ReviewController";
import reviewServices from "./services/ReviewServices";


const routes = Router();

routes.get('/', (req: Request, res: Response) => { res.send('Coworking Book Server') });
routes.post('/user', (req: Request, res: Response) => { userControllers.create(req, res, userServices); });
routes.get('/user/:email', (req: Request, res: Response) => { userControllers.checkEmail(req, res, userServices); })
routes.get('/user/password/:email', (req: Request, res: Response) => { userControllers.getPassword(req, res, userServices); })
routes.post('/login', (req: Request, res: Response) => { userControllers.login(req, res, userServices) });


routes.use(authMiddleware);
//routes.get('/profile', authMiddleware, (req: Request, res: Response) => { userControllers.getProfile(req, res, userServices) });
routes.get('/profile', (req: Request, res: Response) => { userControllers.getProfile(req, res) });
routes.post('/profile/update', (req: Request, res: Response) => { userControllers.updateProfile(req, res, userServices); });
// Reservation routes
routes.get('/reservasi/all/:user_id', (req: Request, res: Response) => {
    reservationController.getAllReservationsUser(req, res, reservationServices);
});

routes.post('/reservasi', (req: Request, res: Response) => { 
    reservationController.create(req, res, reservationServices); 
});

routes.get('/reservasi/user/:user_id', (req: Request, res: Response) => { 
    reservationController.getReservationsByUser(req, res, reservationServices); 
});

routes.post('/reservasi/:reservation_id/verifikasi', (req: Request, res: Response) => { 
    reservationController.verifikasiPembayaran(req, res, reservationServices); 
});

routes.get('/reservasi/reject/:reservation_id', (req: Request, res: Response) => { 
    reservationController.batalkanReservasi(req, res, reservationServices); 
});

routes.put('/reservasi/update', (req: Request, res: Response) => { 
    reservationController.updateReservasi(req, res, reservationServices); 
});

routes.get('/reservasi/available', (req: Request, res: Response) => { 
    reservationController.getAvailableReservationRooms(req, res, reservationServices); 
});

// Notification routes
routes.get('/notifikasi/user/:user_id', (req: Request, res: Response) => { 
    notificationController.getNotifications(req, res, notificationServices); 
});

routes.post('/notifikasi/:notification_id/read', (req: Request, res: Response) => { 
    notificationController.markAsRead(req, res, notificationServices); 
});

routes.get('/notifikasi/unread/:user_id', (req: Request, res: Response) => { 
    notificationController.getUnreadCount(req, res, notificationServices); 
});

// Admin routes (dengan middleware admin)
routes.use('/admin', authMiddleware, adminAuthMiddleware);

routes.get('/admin/dashboard/stats', (req: Request, res: Response) => {
    reservationController.getDashboardStats(req, res, reservationServices);
});

routes.get('/admin/reservasi', (req: Request, res: Response) => {
    reservationController.getAllReservations(req, res, reservationServices);
});


routes.get('/admin/reservasi/pending', (req: Request, res: Response) => {
    reservationController.getPendingReservations(req, res, reservationServices);
});

routes.put('/admin/reservasi/:reservation_id/status', (req: Request, res: Response) => {
    reservationController.updateStatusReservasi(req, res, reservationServices);
});

routes.delete('/admin/reservasi/:id', adminAuthMiddleware, (req: Request, res: Response) => {
    reservationController.deleteReservation(req, res, reservationServices);
});

// Coworking routes untuk admin
routes.get('/admin/coworking', (req: Request, res: Response) => {
    coworkingController.getAllRooms(req, res, coworkingServices);
});

routes.get('/admin/coworking/:coworking_id', (req: Request, res: Response) => {
    coworkingController.getRoomById(req, res, coworkingServices);
});

routes.post('/admin/coworking', (req: Request, res: Response) => {
    coworkingController.createRoom(req, res, coworkingServices);
});

routes.put('/admin/coworking/:coworking_id', (req: Request, res: Response) => {
    coworkingController.updateRoom(req, res, coworkingServices);
});

routes.delete('/admin/coworking/:coworking_id', (req: Request, res: Response) => {
    coworkingController.deleteRoom(req, res, coworkingServices);
});

routes.patch('/admin/coworking/:coworking_id/status', (req: Request, res: Response) => {
    coworkingController.updateRoomStatus(req, res, coworkingServices);
});

routes.get('/coworking/available', authMiddleware, (req: Request, res: Response) => {
    coworkingController.getAvailableRooms(req, res, coworkingServices);
});

// Payment routes untuk admin
routes.get('/admin/payments', (req: Request, res: Response) => {
    paymentController.getAllPayments(req, res, paymentServices);
});

routes.get('/admin/payments/pending', (req: Request, res: Response) => {
    paymentController.getPendingPayments(req, res, paymentServices);
});

routes.post('/admin/payments/:payment_id/verify', (req: Request, res: Response) => {
    paymentController.verifyPayment(req, res, paymentServices);
});

routes.post('/admin/payments/:payment_id/reject', (req: Request, res: Response) => {
    paymentController.rejectPayment(req, res, paymentServices);
});

routes.get('/admin/payments/stats', (req: Request, res: Response) => {
    paymentController.getPaymentStats(req, res, paymentServices);
});

// Admin User Management Routes
routes.get('/admin/users', adminAuthMiddleware, (req: Request, res: Response) => {
    userControllers.getAllUsers(req, res, userServices);
});

routes.post('/admin/users', adminAuthMiddleware, (req: Request, res: Response) => {
    userControllers.createUser(req, res, userServices);
});

routes.put('/admin/users/:id', adminAuthMiddleware, (req: Request, res: Response) => {
    userControllers.updateUser(req, res, userServices);
});

routes.delete('/admin/users/:id', adminAuthMiddleware, (req: Request, res: Response) => {
    userControllers.deleteUser(req, res, userServices);
});

// Review routes
routes.post('/review', authMiddleware, (req: Request, res: Response) => {
    reviewController.createReview(req, res, reviewServices);
});

routes.get('/review/room/:coworking_id', authMiddleware, (req: Request, res: Response) => {
    reviewController.getReviewsByRoom(req, res, reviewServices);
});


export default routes;


